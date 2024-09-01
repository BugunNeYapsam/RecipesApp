import * as React from 'react';
import { ScrollView, View, StyleSheet, Button, SafeAreaView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../Context/AppContext';
import RecipeCard from '../Components/RecipeCard';

export default function Saved() {
  const { savedRecipes, setSavedRecipes } = useAppContext();

  // Saved recipes'lerin null veya undefined olma durumunu kontrol edin
  const handleRemoveRecipe = (recipeToRemove) => {
    setSavedRecipes(prevSaved => prevSaved.filter(r => r.isim !== recipeToRemove.isim));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#bbd0c4', '#a1d0c4', '#bbd0c4']}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <ScrollView>
            {/* savedRecipes değerinin tanımlı ve bir dizi olduğundan emin olun */}
            {(savedRecipes || []).map((r, index) => (
              <View key={index} style={styles.recipeContainer}>
                <RecipeCard
                  foodName={r.isim}
                  ingredients={r.malzemeler}
                  recipeSteps={r.tarif}
                  imageUrl={"https://picsum.photos/200/300"}
                  expanded={false}
                />
                <Button
                  title="Remove"
                  onPress={() => handleRemoveRecipe(r)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  recipeContainer: {
    marginBottom: 10,
  },
});
