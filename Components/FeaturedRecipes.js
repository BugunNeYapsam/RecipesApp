import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, Animated, Easing, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FeaturedRecipes = ({ showAll }) => {
    const navigation = useNavigation();
    const { featuredRecipes, selectedLanguage, languageStore, setSelectedFeaturedRecipe, isDarkMode } = useAppContext();
    const [loading, setLoading] = useState(true);
    const shimmerValue = useRef(new Animated.Value(0)).current;
    const [featuredRecipeToNavigate, setFeaturedRecipeToNavigate] = useState(null);

    const dynamicSafeAreaStyle = {
      backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE',
    };

    const dynamicPageTitleStyle = {
      color: isDarkMode ? '#c781a4' : '#444',
    };
  
    const dynamicSeeAllStyle = {
      color: isDarkMode ? '#5c86ff' : '#0445ff',
    };

    useEffect(() => {
      if (featuredRecipeToNavigate) {
        navigation.navigate(featuredRecipeToNavigate?.name[selectedLanguage]);
        setFeaturedRecipeToNavigate(null);
      }
    }, [featuredRecipeToNavigate, selectedLanguage, navigation]);

    useEffect(() => {
      if (featuredRecipes && featuredRecipes.length > 0) {
        setLoading(false);
      }

      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );

      shimmerAnimation.start();

      return () => shimmerAnimation.stop();
    }, [featuredRecipes, shimmerValue]);

    const handleOnPressFeaturedRecipe = (featured_recipe_object) => {
      setSelectedFeaturedRecipe(featured_recipe_object);
      setFeaturedRecipeToNavigate(featured_recipe_object);
    };

    const renderPlaceholders = () => {
      const placeholders = new Array(5).fill(0);
      return placeholders.map((_, index) => (
        <View key={index} style={[styles.placeholderCard, { width: cardWidth, height: cardHeight, marginBottom: showAll ? 10 : 0 }]}>
          <Animated.View style={[styles.placeholderImage, { opacity: shimmerValue }]} />
          <View style={styles.placeholderOverlay}>
            <Animated.View style={[styles.placeholderText, { opacity: shimmerValue }]} />
          </View>
        </View>
      ));
    };

    const calculateCardSize = () => {
      const cardWidth = screenWidth < 600 ? (screenWidth / 2) - 20 : (screenWidth / 3) - 20;
      const cardHeight = screenHeight < 800 ? 180 : 220;
      return { cardWidth, cardHeight };
    };

    const calculateFontSize = () => {
      return screenWidth < 600 ? 14 : 18;
    };

    const { cardWidth, cardHeight } = calculateCardSize();
    const fontSize = calculateFontSize();

    if (showAll) {
      return (
        <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
          <View style={styles.headerNavButton}>
            <TouchableOpacity onPress={() => navigation?.goBack()}>
              <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#c781a4' : '#444'} />
            </TouchableOpacity>
            <Text style={[styles.text, dynamicPageTitleStyle, { fontSize }]}>{languageStore[selectedLanguage]["featured_recipes"]?.toUpperCase() || '' }</Text>
          </View>
          {
            loading ? renderPlaceholders() :
            <FlatList
              data={featuredRecipes}
              keyExtractor={(item, index) => index.toString()}
              numColumns={screenWidth < 600 ? 2 : 3}
              columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
              contentContainerStyle={styles.grid}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.recipeCard, { width: cardWidth, height: cardHeight }]} onPress={() => handleOnPressFeaturedRecipe(item)}>
                  <Image source={item?.imageUrl !== "" ? { uri: item?.imageUrl } : require('../assets/FoodPlaceholder.png')} style={styles.recipeImage} />
                  <Text style={[styles.recipeName, { fontSize }]}>{item.name[selectedLanguage]}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={renderPlaceholders}
            />
          }
        </SafeAreaView>
      );
    }
  
    return (
      <View>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, dynamicPageTitleStyle, { fontSize: fontSize * 1.2 }]}>{languageStore[selectedLanguage]["featured_recipes"]}</Text>
          {
            !loading && 
            <TouchableOpacity onPress={() => navigation.navigate(languageStore[selectedLanguage]["all_featured_recipes"])}>
              <Text style={[styles.seeAll, dynamicSeeAllStyle, { fontSize: fontSize }]}>{languageStore[selectedLanguage]["see_all"]}</Text>
            </TouchableOpacity>
          }
        </View>
        <ScrollView horizontal style={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
          {loading ? renderPlaceholders() : featuredRecipes.slice(0, 5)?.map((recipe, index) => (
            <TouchableOpacity key={index} style={[styles.featuredCardHome, { width: cardWidth, height: cardHeight }]} onPress={() => handleOnPressFeaturedRecipe(recipe)}>
              <Image source={recipe?.imageUrl !== "" ? { uri: recipe?.imageUrl } : require('../assets/FoodPlaceholder.png')} style={styles.recipeImage} />
              <View style={styles.featuredOverlay}>
                <Text style={[styles.recipeName, { fontSize }]}>{recipe.name[selectedLanguage]}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: "12%",
    paddingHorizontal: 16
  },
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  headerNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 30,
    marginLeft: -10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: 'blue',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  featuredCardHome: {
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6B2346',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  recipeCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B2346',
  },
  recipeImage: {
    width: '100%',
    height: '85%',
    resizeMode: 'cover',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
    textAlign: 'center',
  },
  placeholderCard: {
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  placeholderImage: {
    width: '100%',
    height: '75%',
    borderRadius: 10,
    backgroundColor: '#D0D0D0',
  },
  placeholderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    width: '60%',
    height: 20,
    backgroundColor: '#C0C0C0',
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default FeaturedRecipes;