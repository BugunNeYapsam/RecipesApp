// Saved.js
import React from 'react';
import { ScrollView, View, StyleSheet, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useAppContext } from '../Context/AppContext';
import RecipeCard from '../Components/RecipeCard';

export default function Saved() {
  const { savedRecipes, removeRecipe } = useAppContext();

  const handleSave = (recipe) => {
    removeRecipe(recipe);
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
                  foodName={r.isim}
                  ingredients={r.malzemeler}
                  recipeSteps={r.tarif}
                  imageUrl={"https://picsum.photos/200/300"}
                  expanded={false}
                  saved={true}
                  onSave={() => handleSave(r)}
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
  },
  recipeContainer: {
    marginBottom: 10,
  },
  noRecipesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});
