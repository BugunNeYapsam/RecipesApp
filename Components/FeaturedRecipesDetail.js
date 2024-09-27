import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Image, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native'; // Import Image
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';

const FeaturedRecipesDetail = ({ updateRecipeRating }) => {
  const { recipeRatings, updateSpecificRecipeRating, isDarkMode, selectedLanguage, languageStore, selectedFeaturedRecipe, setSelectedFeaturedRecipe, addRecipe, removeRecipe, savedRecipes } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [saved, setSaved] = useState(savedRecipes.includes(selectedFeaturedRecipe?.name[selectedLanguage]));
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
    }
  }, []);
  
  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE'
  };

  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#7f405f'
  };

  const saveRatingToDevice = async (rating) => {
    try {
      await AsyncStorage.setItem(`rating_${selectedFeaturedRecipe?.name[selectedLanguage]}`, JSON.stringify(rating));
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
      console.error("Error checking if recipe has been rated:", error);
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
      console.error("Error marking recipe as rated:", error);
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
      const dbUpdateResult = await updateRecipeRating(recipe_id, newRating, updateSpecificRecipeRating);  
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
          <MaterialIcons name="star" size={24} color={starColor} style={{ opacity: starOpacity }} />
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
          <MaterialIcons name="star-half" size={24} color={starColor} style={{ opacity: starOpacity }} />
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
          <MaterialIcons name="star-border" size={24} color={starColor} style={{ opacity: starOpacity }} />
        </TouchableOpacity>
      );
    }
  
    return stars;
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
      <View style={styles.headerBackButtonRow}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#c781a4' : '#7f405f'} />
        </TouchableOpacity>
        <Text style={[styles.text, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["back"]?.toUpperCase() || '' }</Text>
      </View>
      <ScrollView style={[styles.card]}>
        <LinearGradient
          colors={isDarkMode ? ['#894d66', '#cccddd'] : ['#dddfff', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{selectedFeaturedRecipe?.name[selectedLanguage]}</Text>
          </View>

          <>
            <Image source={selectedFeaturedRecipe?.imageUrl !== "" ? { uri: selectedFeaturedRecipe?.imageUrl } : require('../assets/FoodPlaceholder.png')} style={styles.imageExpanded} resizeMode="cover" />
            <View style={styles.contentContainer}>
              <Text style={styles.subtitle}>{languageStore[selectedLanguage]["ingredients"]}:</Text>
              <View style={styles.ingredientsList}>
                {selectedFeaturedRecipe?.ingredients[selectedLanguage]?.map((ingredient, index) => (
                  <Text key={index} style={styles.ingredientItem}>
                    • {ingredient}
                  </Text>
                ))}
              </View>
              <Text style={styles.subtitle}>{languageStore[selectedLanguage]["recipe"]}:</Text>
              <View style={styles.stepsList}>
                {selectedFeaturedRecipe?.recipe[selectedLanguage]?.map((step, index) => (
                  <View key={index} style={styles.stepItemContainer}>
                    <Text style={styles.stepNumber}>{index + 1}.</Text>
                    <Text style={styles.stepText}>{step.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{recipeRatings[selectedFeaturedRecipe?.id]?.toFixed(1)}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(selectedFeaturedRecipe?.id)}
                </View>

                {loading ? (
                  <ActivityIndicator style={{marginLeft: 15}} size="small" color="#FFC107" />
                ) : showSuccess ? (
                  <Animated.View style={[styles.successTick, { opacity: successOpacity }]}>
                    <Ionicons name="checkmark-circle" size={30} color="green" />
                  </Animated.View>
                ) : showFailure ? (
                  <Animated.View style={[styles.failureTick, { opacity: failureOpacity }]}>
                    <Ionicons name="close-circle" size={30} color="red" />
                  </Animated.View>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => handleSave(selectedFeaturedRecipe, !saved)}>
                <MaterialIcons name={saved ? 'bookmark' : 'bookmark-border'} size={24} color={'#888'} />
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
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  card: {
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: .5,
    borderColor: "#555",
    margin: 16,
    marginBottom: "25%"
  },
  gradient: {
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: -5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    marginHorizontal: 10,
  },
  image: {
    position: "absolute",
    right: 0,
    width: 100,
    height: 100,
    borderRadius: 60,
    borderColor: "#555",
    borderWidth: .5,
    marginLeft: 10,
    marginRight: -30,
  },
  imageExpanded: {
    display: "flex",
    justifyContent: "center",
    height: 200,
    width: "100%",
    borderRadius: 5,
    borderColor: "#555",
    borderWidth: .5,
    marginTop: 20,
    marginBottom: 10,
  },
  contentContainer: {
    borderRadius: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ingredientsList: {
    marginBottom: 10,
  },
  ingredientItem: {
    fontSize: 16,
    color: '#333',
  },
  stepsList: {
    marginBottom: 10,
  },
  stepItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    marginTop: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  successTick: {
    marginLeft: 10,
  },
  failureTick: {
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 10,
    color: '#555',
    fontWeight: "500"
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerBackButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 30,
  },
});

export default FeaturedRecipesDetail;