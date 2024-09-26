import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const FeaturedRecipes = ({ showAll }) => {
    const navigation = useNavigation();
    const { featuredRecipes, selectedLanguage, languageStore, selectedFeaturedRecipe, setSelectedFeaturedRecipe, isDarkMode } = useAppContext();
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
      if (selectedFeaturedRecipe) {
        navigation.navigate(selectedFeaturedRecipe.name[selectedLanguage]);
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
        <View key={index} style={styles.placeholderCard}>
          <Animated.View style={[styles.placeholderImage, { opacity: shimmerValue }]} />
          <View style={styles.placeholderOverlay}>
            <Animated.View style={[styles.placeholderText, { opacity: shimmerValue }]} />
          </View>
        </View>
      ));
    };

    if (showAll) {
      return (
        <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
          <View style={styles.headerNavButton}>
            <TouchableOpacity onPress={() => navigation?.goBack()}>
              <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#c781a4' : '#444'} />
            </TouchableOpacity>
            <Text style={[styles.text, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["featured_recipes"]?.toUpperCase() || '' }</Text>
          </View>
          <ScrollView style={styles.container}>
            <View style={styles.grid}>
              {loading ? renderPlaceholders() : featuredRecipes?.map((recipe, index) => (
                <TouchableOpacity key={index} style={styles.recipeCard} onPress={() => handleOnPressFeaturedRecipe(recipe)}>
                  <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
                  <Text style={styles.recipeName}>{recipe.name[selectedLanguage]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  
    return (
      <View>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["featured_recipes"]}</Text>
          {
            !loading && 
            <TouchableOpacity onPress={() => navigation.navigate(languageStore[selectedLanguage]["all_featured_recipes"])}>
              <Text style={[styles.seeAll, dynamicSeeAllStyle]}>{languageStore[selectedLanguage]["see_all"]}</Text>
            </TouchableOpacity>
          }
        </View>
        <ScrollView horizontal style={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
          {loading ? renderPlaceholders() : featuredRecipes.slice(0, 5)?.map((recipe, index) => (
            <TouchableOpacity key={index} style={styles.featuredCardHome} onPress={() => handleOnPressFeaturedRecipe(recipe)}>
              <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
              <View style={styles.featuredOverlay}>
                <Text style={styles.recipeName}>{recipe.name[selectedLanguage]}</Text>
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
    padding: 10,
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
    width: 240,
    height: 180,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6B2346',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  featuredName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: "25%",
  },
  recipeCard: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B2346',
  },
  recipeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  placeholderCard: {
    width: 240,
    height: 180,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    elevation: 2,
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
});

export default FeaturedRecipes;