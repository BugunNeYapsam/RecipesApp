import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useAppContext } from '../Context/AppContext';
import RecipeCard from '../Components/RecipeCard';

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
      <Text style={[styles.text, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["saveds"].toUpperCase()}</Text>
      <View style={styles.container}>
        <ScrollView>
          {savedRecipes.length > 0 ? (
            savedRecipes.map((r, index) => (
              <View key={index} style={styles.recipeContainer}>
                <RecipeCard
                  key={index}
                  recipeID={r.id}
                  imgUrl={r.imageUrl}
                  foodName={r.isim}
                  ingredients={r.malzemeler}
                  recipeSteps={r.tarif}
                  expanded={expandedCardIndex === index}
                  toggleExpand={() => toggleExpand(index)}
                  onSave={(isSaved) => handleSave(r, isSaved)}
                  saved={savedRecipes.some(savedRecipe => savedRecipe.isim === r.isim)}
                  rating={r.rating || 0} 
                  updateRecipeRating={updateRecipeRating}
                />
              </View>
            ))
          ) : (
            <Text style={styles.noRecipesText}>{languageStore[selectedLanguage]["no_saved_recipes"]}</Text>
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
    color: '#333',
  },
});