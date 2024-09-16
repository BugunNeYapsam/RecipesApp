import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useAppContext } from '../Context/AppContext';
import RecipeCard from '../Components/RecipeCard';

export default function Saved({ updateRecipeRating }) {
  const { savedRecipes, removeRecipe } = useAppContext();
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  const handleSave = (recipe) => {
    removeRecipe(recipe);
  };

  const toggleExpand = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.text}>KAYDEDİLENLER</Text>
      <View style={styles.container}>
        <ScrollView>
          {savedRecipes.length > 0 ? (
            savedRecipes.map((r, index) => (
              <View key={index} style={styles.recipeContainer}>
                <RecipeCard
                  key={index}
                  recipeID={r.id}
                  foodName={r.isim}
                  ingredients={r.malzemeler}
                  recipeSteps={r.tarif}
                  imageUrl={"https://picsum.photos/200/300"}
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
            <Text style={styles.noRecipesText}>No recipes saved yet.</Text>
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
    margin: 11,
    padding: 11,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingBottom: "20%"
  },
  noRecipesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});