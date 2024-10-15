import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions, // Import Dimensions
} from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';

// Get screen width and define breakpoint
const { width: screenWidth } = Dimensions.get('window');
const isLargeScreen = screenWidth > 600; // Adjust breakpoint as needed

const FeaturedRecipesDetail = ({ updateRecipeRating }) => {
  const {
    recipeRatings,
    updateSpecificRecipeRating,
    isDarkMode,
    selectedLanguage,
    languageStore,
    selectedFeaturedRecipe,
    setSelectedFeaturedRecipe,
    addRecipe,
    removeRecipe,
    savedRecipes,
  } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [saved, setSaved] = useState(
    savedRecipes.includes(selectedFeaturedRecipe?.name[selectedLanguage])
  );
  const successOpacity = useRef(new Animated.Value(0)).current;
  const failureOpacity = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  useEffect(() => {
    const fetchRatedStatus = async () => {
      const rated = await checkIfRated(selectedFeaturedRecipe?.id);
      setIsRated(rated);
    };

    fetchRatedStatus();
  }, [selectedFeaturedRecipe?.id]);

  useEffect(() => {
    return () => {
      setSelectedFeaturedRecipe(undefined);
    };
  }, []);

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE',
  };

  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#7f405f',
  };

  const saveRatingToDevice = async (rating) => {
    try {
      await AsyncStorage.setItem(
        `rating_${selectedFeaturedRecipe?.name[selectedLanguage]}`,
        JSON.stringify(rating)
      );
    } catch (error) {
      console.error('Failed to save rating:', error);
      throw error;
    }
  };

  const checkIfRated = async (recipe_id) => {
    try {
      const ratedRecipes = await AsyncStorage.getItem('ratedRecipes');
      if (ratedRecipes !== null) {
        const ratedList = JSON.parse(ratedRecipes);
        return ratedList.includes(recipe_id);
      }
      return false;
    } catch (error) {
      console.error('Error checking if recipe has been rated:', error);
      return false;
    }
  };

  const markAsRated = async (recipe_id) => {
    try {
      const ratedRecipes = await AsyncStorage.getItem('ratedRecipes');
      let ratedList = [];
      if (ratedRecipes !== null) {
        ratedList = JSON.parse(ratedRecipes);
      }
      ratedList.push(recipe_id);
      await AsyncStorage.setItem('ratedRecipes', JSON.stringify(ratedList));
    } catch (error) {
      console.error('Error marking recipe as rated:', error);
    }
  };

  const handleRating = async (recipe_id, newRating) => {
    const validRating = Math.max(0, Math.min(5, newRating));
    setLoading(true);

    const hasRated = await checkIfRated(recipe_id);
    if (hasRated) {
      setLoading(false);
      return;
    }

    try {
      const dbUpdateResult = await updateRecipeRating(
        recipe_id,
        validRating,
        updateSpecificRecipeRating
      );
      if (dbUpdateResult) {
        await saveRatingToDevice(validRating);
        await markAsRated(recipe_id);
        setIsRated(true);
        triggerSuccessAnimation();
      } else {
        triggerFailureAnimation();
      }
    } catch (error) {
      triggerFailureAnimation();
    } finally {
      setLoading(false);
    }
  };

  const triggerSuccessAnimation = () => {
    setShowSuccess(true);
    Animated.sequence([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(successOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSuccess(false));
  };

  const triggerFailureAnimation = () => {
    setShowFailure(true);
    Animated.sequence([
      Animated.timing(failureOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(failureOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setShowFailure(false));
  };

  const handleSave = (recipe, saved) => {
    if (saved) {
      addRecipe(recipe);
    } else {
      removeRecipe(recipe);
    }
    setSaved(saved);
  };

  const renderStars = (recipe_id) => {
    const current_rating = recipeRatings[parseInt(recipe_id)] || 0;
    const stars = [];
    const fullStars = Math.floor(current_rating);
    const hasHalfStar = current_rating % 1 !== 0;

    const starColor = isRated ? '#AAAAAA' : '#FFC107';
    const starOpacity = isRated ? 0.5 : 1;

    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <TouchableOpacity
          key={`full-${i}`}
          onPress={() => !isRated && handleRating(parseInt(recipe_id), i)}
          disabled={isRated}
        >
          <MaterialIcons
            name="star"
            size={isLargeScreen ? 28 : 24}
            color={starColor}
            style={{ opacity: starOpacity }}
          />
        </TouchableOpacity>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <TouchableOpacity
          key="half-star"
          onPress={() => !isRated && handleRating(parseInt(recipe_id), fullStars + 1)}
          disabled={isRated}
        >
          <MaterialIcons
            name="star-half"
            size={isLargeScreen ? 28 : 24}
            color={starColor}
            style={{ opacity: starOpacity }}
          />
        </TouchableOpacity>
      );
    }

    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(
        <TouchableOpacity
          key={`empty-${i}`}
          onPress={() => !isRated && handleRating(parseInt(recipe_id), i + 1)}
          disabled={isRated}
        >
          <MaterialIcons
            name="star-border"
            size={isLargeScreen ? 28 : 24}
            color={starColor}
            style={{ opacity: starOpacity }}
          />
        </TouchableOpacity>
      );
    }

    return stars;
  };

  return (
    <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
      <View style={styles.headerBackButtonRow}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons
            name="arrow-back"
            size={isLargeScreen ? 28 : 24}
            color={isDarkMode ? '#c781a4' : '#7f405f'}
          />
        </TouchableOpacity>
        <Text style={[styles.text, dynamicPageTitleStyle]}>
          {languageStore[selectedLanguage]['back']?.toUpperCase() || ''}
        </Text>
      </View>
      <ScrollView style={[styles.card]}>
        <LinearGradient
          colors={isDarkMode ? ['#894d66', '#cccddd'] : ['#dddfff', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {selectedFeaturedRecipe?.name[selectedLanguage]}
            </Text>
          </View>

          <>
            <Image
              source={
                selectedFeaturedRecipe?.imageUrl !== ''
                  ? { uri: selectedFeaturedRecipe?.imageUrl }
                  : require('../assets/FoodPlaceholder.png')
              }
              style={styles.imageExpanded}
              resizeMode="cover"
            />
            <View style={styles.contentContainer}>
              <Text style={styles.subtitle}>
                {languageStore[selectedLanguage]['ingredients']}:
              </Text>
              <View style={styles.ingredientsList}>
                {selectedFeaturedRecipe?.ingredients[selectedLanguage]?.map(
                  (ingredient, index) => (
                    <Text key={index} style={styles.ingredientItem}>
                      • {ingredient}
                    </Text>
                  )
                )}
              </View>
              <Text style={styles.subtitle}>
                {languageStore[selectedLanguage]['recipe']}:
              </Text>
              <View style={styles.stepsList}>
                {selectedFeaturedRecipe?.recipe[selectedLanguage]?.map(
                  (step, index) => (
                    <View key={index} style={styles.stepItemContainer}>
                      <Text style={styles.stepNumber}>{index + 1}.</Text>
                      <Text style={styles.stepText}>{step.trim()}</Text>
                    </View>
                  )
                )}
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                  {recipeRatings[selectedFeaturedRecipe?.id]?.toFixed(1)}
                </Text>
                <View style={styles.starsContainer}>
                  {renderStars(selectedFeaturedRecipe?.id)}
                </View>

                {loading ? (
                  <ActivityIndicator
                    style={{ marginLeft: 15 }}
                    size="small"
                    color="#FFC107"
                  />
                ) : showSuccess ? (
                  <Animated.View
                    style={[styles.successTick, { opacity: successOpacity }]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={isLargeScreen ? 34 : 30}
                      color="green"
                    />
                  </Animated.View>
                ) : showFailure ? (
                  <Animated.View
                    style={[styles.failureTick, { opacity: failureOpacity }]}
                  >
                    <Ionicons
                      name="close-circle"
                      size={isLargeScreen ? 34 : 30}
                      color="red"
                    />
                  </Animated.View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => handleSave(selectedFeaturedRecipe, !saved)}
              >
                <MaterialIcons
                  name={saved ? 'bookmark' : 'bookmark-border'}
                  size={isLargeScreen ? 28 : 24}
                  color={'#888'}
                />
              </TouchableOpacity>
            </View>
          </>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: isLargeScreen ? '20%' : '35%' 
  },
  card: {
    borderRadius: isLargeScreen ? 15 : 10,
    borderWidth: 0.5,
    borderColor: '#555',
    margin: isLargeScreen ? 24 : 16,
    marginBottom: isLargeScreen ? 54 : 16,
  },
  gradient: {
    borderRadius: isLargeScreen ? 15 : 10,
    padding: isLargeScreen ? 30 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: -5,
  },
  title: {
    fontSize: isLargeScreen ? 24 : 18,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    marginHorizontal: isLargeScreen ? 15 : 10,
  },
  imageExpanded: {
    display: 'flex',
    justifyContent: 'center',
    height: isLargeScreen ? 350 : 200,
    width: '100%',
    borderRadius: isLargeScreen ? 10 : 5,
    borderColor: '#555',
    borderWidth: 0.5,
    marginTop: isLargeScreen ? 25 : 20,
    marginBottom: isLargeScreen ? 15 : 10,
  },
  contentContainer: {
    borderRadius: isLargeScreen ? 15 : 10,
    marginTop: isLargeScreen ? 15 : 10,
  },
  subtitle: {
    fontSize: isLargeScreen ? 22 : 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isLargeScreen ? 7 : 5,
  },
  ingredientsList: {
    marginBottom: isLargeScreen ? 15 : 10,
  },
  ingredientItem: {
    fontSize: isLargeScreen ? 20 : 14,
    color: '#333',
  },
  stepsList: {
    marginBottom: isLargeScreen ? 15 : 10,
  },
  stepItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: isLargeScreen ? 20 : 14,
    color: '#333',
    marginRight: isLargeScreen ? 7 : 5,
  },
  stepText: {
    fontSize: isLargeScreen ? 20 : 14,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: isLargeScreen ? 25 : 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: isLargeScreen ? 12 : 10,
  },
  successTick: {
    marginLeft: isLargeScreen ? 12 : 10,
  },
  failureTick: {
    marginLeft: isLargeScreen ? 12 : 10,
  },
  ratingText: {
    fontSize: isLargeScreen ? 20 : 14,
    marginRight: isLargeScreen ? 12 : 10,
    color: '#555',
    fontWeight: '500',
  },
  text: {
    fontSize: isLargeScreen ? 22 : 14,
    fontWeight: 'bold',
    marginLeft: isLargeScreen ? 15 : 10,
  },
  headerBackButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isLargeScreen ? 25 : 20,
    marginBottom: isLargeScreen ? 15 : 10,
    marginTop: isLargeScreen ? 35 : 30,
  },
});

export default FeaturedRecipesDetail;