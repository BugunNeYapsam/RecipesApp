import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, SafeAreaView, Platform, StatusBar, Image, Dimensions } from 'react-native';
import { useAppContext } from '../Context/AppContext';
import RecipeCard from '../Components/RecipeCard';
import NotFoundImage from "../assets/no_saved_food_found.png";

const { width, height } = Dimensions.get('window');

export default function Saved({ updateRecipeRating }) {
  const { savedRecipes, removeRecipe, isDarkMode, selectedLanguage, languageStore } = useAppContext();
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE'
  };
  
  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#7f405f'
  };

  const handleSave = (recipe) => {
    removeRecipe(recipe);
  };

  const toggleExpand = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
      <Text style={[styles.text, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["saveds"]?.toUpperCase()}</Text>
      <View style={styles.container}>
        <ScrollView>
          {savedRecipes.length > 0 ? (
            savedRecipes.map((r, index) => (
              <View key={index} style={styles.recipeContainer}>
                <RecipeCard
                  key={index}
                  recipeID={r.id}
                  imgUrl={r.imageUrl}
                  foodName={r.name[selectedLanguage]}
                  ingredients={r.ingredients[selectedLanguage]}
                  recipeSteps={r.recipe[selectedLanguage]}
                  expanded={expandedCardIndex === index}
                  toggleExpand={() => toggleExpand(index)}
                  onSave={(isSaved) => handleSave(r, isSaved)}
                  saved={savedRecipes.some(savedRecipe => savedRecipe.id === r.id)}
                  rating={r.rating || 0} 
                  updateRecipeRating={updateRecipeRating}
                />
              </View>
            ))
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: "20%"}}>
              <Image source={NotFoundImage} style={styles.image} />
              <Text style={[styles.noRecipesText, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["no_saved_recipes"]}</Text>
            </View>
          )}
        </ScrollView>
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