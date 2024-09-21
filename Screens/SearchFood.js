import * as React from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import RecipeCard from '../Components/RecipeCard';
import SearchBar from '../Components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';

export default function SearchFood({ updateRecipeRating }) {
  const { allRecipeData, savedRecipes, addRecipe, removeRecipe, isDarkMode } = useAppContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedCardIndex, setExpandedCardIndex] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('none');
  const [selectedChips, setSelectedChips] = React.useState([]);

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE'
  };

  const sortRecipes = (recipes, order) => {
    if (order === 'asc') {
      return recipes.sort((a, b) => a.isim.localeCompare(b.isim));
    } else if (order === 'desc') {
      return recipes.sort((a, b) => b.isim.localeCompare(a.isim));
    }
    return recipes;
  };

  const searchLower = searchTerm?.toLowerCase();
  const selectedChipsLower = selectedChips.map(chip => chip.toLowerCase());
  
  const filteredRecipes = allRecipeData?.filter(recipe => {
    const recipeNameLower = recipe.isim.toLowerCase();
    const ingredientsLower = recipe.malzemeler.map(ingredient => ingredient.toLowerCase()).join("--");
  
    if (selectedChipsLower.length > 0) {
      return selectedChipsLower.some(chip => recipeNameLower.includes(chip) || ingredientsLower.includes(chip));
    }
  
    return recipeNameLower.includes(searchLower) || ingredientsLower.includes(searchLower);
  });

  const sortedRecipes = sortRecipes(filteredRecipes, sortOrder);

  const toggleExpand = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  const handleSort = () => {
    setSortOrder(prevOrder => {
      if (prevOrder === 'none') return 'asc';
      if (prevOrder === 'asc') return 'desc';
      return 'none';
    });
  };

  const handleSuggestionSelect = (suggestion) => {
    setSelectedChips(prevChips => [...prevChips, suggestion]);
    setSearchTerm('');
  };

  const handleChipRemove = (chip) => {
    setSelectedChips(prevChips => prevChips.filter(c => c !== chip));
  };

  const handleSave = (recipe, isSaved) => {
    if (isSaved) {
      addRecipe(recipe);
    } else {
      removeRecipe(recipe);
    }
  };

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
      <View style={styles.container}>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSortPress={handleSort}
          sortOrder={sortOrder}
          onSuggestionSelect={handleSuggestionSelect}
          selectedChips={selectedChips}
          onChipRemove={handleChipRemove}
          isDarkMode={isDarkMode}
          suggestionListWithoutCategory={true}
        />
        <ScrollView>
          {sortedRecipes?.map((r, index) => (
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
          ))}
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
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: "20%"
  },
});