import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Platform, StatusBar, Image, Dimensions, findNodeHandle, LayoutAnimation, FlatList } from 'react-native';
import { useAppContext } from '../Context/AppContext';
import RecipeCard from '../Components/RecipeCard';
import NotFoundImage from "../assets/no_saved_food_found.png";

const { width, height } = Dimensions.get('window');

// Memoized RecipeCard component to prevent unnecessary re-renders
const MemoizedRecipeCard = React.memo(RecipeCard);

export default function Saved({ updateRecipeRating }) {
  const { savedRecipes, removeRecipe, isDarkMode, selectedLanguage, languageStore } = useAppContext();
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const scrollViewRef = useRef();
  const cardRefs = useRef({});

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE'
  };

  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#7f405f'
  };

  const handleSave = useCallback((recipe) => {
    removeRecipe(recipe);
  }, [removeRecipe]);

  const toggleExpand = useCallback((index) => {
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
            (error) => console.error("Failed to measure layout:", error)
          );
        }
      }
    }, 200);
  }, [expandedCardIndex]);

  const renderRecipe = useCallback(({ item, index }) => (
    <View ref={ref => cardRefs.current[index] = ref} style={styles.recipeContainer}>
      <MemoizedRecipeCard
        key={index}
        recipeID={item.id}
        imgUrl={item.imageUrl}
        foodName={item.name[selectedLanguage]}
        ingredients={item.ingredients[selectedLanguage]}
        recipeSteps={item.recipe[selectedLanguage]}
        expanded={expandedCardIndex === index}
        toggleExpand={() => toggleExpand(index)}
        onSave={(isSaved) => handleSave(item, isSaved)}
        saved={savedRecipes.some(savedRecipe => savedRecipe.id === item.id)}
        rating={item.rating || 0}
        updateRecipeRating={updateRecipeRating}
      />
    </View>
  ), [expandedCardIndex, selectedLanguage, toggleExpand, handleSave, savedRecipes, updateRecipeRating]);

  return (
    <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
      <Text style={[styles.text, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["saveds"]?.toUpperCase()}</Text>
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
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: "20%" }}>
            <Image source={NotFoundImage} style={styles.image} />
            <Text style={[styles.noRecipesText, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["no_saved_recipes"]}</Text>
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
    marginTop: 30,
    marginLeft: 20,
  },
  image: {
    width: width * 0.35,
    height: height * 0.15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    paddingVertical: 35,
    paddingHorizontal: 16,
    paddingBottom: "20%"
  },
  noRecipesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});