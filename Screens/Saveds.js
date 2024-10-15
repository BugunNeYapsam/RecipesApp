import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  findNodeHandle,
  FlatList,
} from 'react-native';
import { useAppContext } from '../Context/AppContext';
import RecipeCard from '../Components/RecipeCard';
import NotFoundImage from '../assets/no_saved_food_found.png';

// Get screen dimensions and define breakpoint
const { width, height } = Dimensions.get('window');
const isLargeScreen = width > 600; // Adjust breakpoint as needed

// Memoized RecipeCard component to prevent unnecessary re-renders
const MemoizedRecipeCard = React.memo(RecipeCard);

export default function Saved({ updateRecipeRating }) {
  const {
    savedRecipes,
    removeRecipe,
    isDarkMode,
    selectedLanguage,
    languageStore,
  } = useAppContext();
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const scrollViewRef = useRef();
  const cardRefs = useRef({});

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE',
  };

  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#7f405f',
  };

  const handleSave = useCallback(
    (recipe) => {
      removeRecipe(recipe);
    },
    [removeRecipe]
  );

  const toggleExpand = useCallback(
    (index) => {
      setExpandedCardIndex(expandedCardIndex === index ? null : index);

      setTimeout(() => {
        if (expandedCardIndex !== index && scrollViewRef.current) {
          const cardRef = cardRefs.current[index];
          if (cardRef) {
            cardRef.measureLayout(
              findNodeHandle(scrollViewRef.current),
              (x, y) => {
                scrollViewRef.current.scrollToOffset({ offset: y, animated: true });
              },
              (error) => console.error('Failed to measure layout:', error)
            );
          }
        }
      }, 200);
    },
    [expandedCardIndex]
  );

  const renderRecipe = useCallback(
    ({ item, index }) => (
      <View
        ref={(ref) => (cardRefs.current[index] = ref)}
        style={styles.recipeContainer}
      >
        <MemoizedRecipeCard
          key={index}
          recipeID={item.id}
          imgUrl={item.imageUrl}
          foodName={item.name[selectedLanguage]}
          ingredients={item.ingredients[selectedLanguage]}
          recipeSteps={item.recipe[selectedLanguage]}
          expanded={expandedCardIndex === index}
          toggleExpand={() => toggleExpand(index)}
          onSave={() => handleSave(item)}
          saved={savedRecipes.some((savedRecipe) => savedRecipe.id === item.id)}
          rating={item.rating || 0}
          updateRecipeRating={updateRecipeRating}
        />
      </View>
    ),
    [
      expandedCardIndex,
      selectedLanguage,
      toggleExpand,
      handleSave,
      savedRecipes,
      updateRecipeRating,
    ]
  );

  return (
    <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
      <Text style={[styles.text, dynamicPageTitleStyle]}>
        {languageStore[selectedLanguage]['saveds']?.toUpperCase()}
      </Text>
      <View style={styles.container}>
        {savedRecipes.length > 0 ? (
          <FlatList
            ref={scrollViewRef}
            data={savedRecipes}
            renderItem={renderRecipe}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
          />
        ) : (
          <View style={styles.noRecipesContainer}>
            <Image source={NotFoundImage} style={styles.image} />
            <Text style={[styles.noRecipesText, dynamicPageTitleStyle]}>
              {languageStore[selectedLanguage]['no_saved_recipes']}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  text: {
    color: '#65d6',
    fontWeight: 'bold',
    marginTop: isLargeScreen ? 40 : 30,
    marginLeft: isLargeScreen ? 30 : 20,
    fontSize: isLargeScreen ? 22 : 16,
  },
  image: {
    width: isLargeScreen ? width * 0.3 : width * 0.35,
    height: isLargeScreen ? height * 0.2 : height * 0.15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    paddingVertical: isLargeScreen ? 45 : 35,
    paddingHorizontal: isLargeScreen ? 24 : 16,
    paddingBottom: '20%',
  },
  noRecipesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isLargeScreen ? '-40%' : '-50%',
  },
  noRecipesText: {
    textAlign: 'center',
    marginTop: isLargeScreen ? 40 : 20,
    fontSize: isLargeScreen ? 26 : 18,
  },
  recipeContainer: {
    marginBottom: isLargeScreen ? 20 : 15,
  },
});