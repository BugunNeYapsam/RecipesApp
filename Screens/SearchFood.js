import * as React from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView, Platform, StatusBar, findNodeHandle } from 'react-native';
import RecipeCard from '../Components/RecipeCard';
import SearchBar from '../Components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';

export default function SearchFood({ updateRecipeRating }) {
  const { allRecipeData, savedRecipes, addRecipe, removeRecipe, isDarkMode, selectedLanguage } = useAppContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedCardIndex, setExpandedCardIndex] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('none');
  const [selectedChips, setSelectedChips] = React.useState([]);
  
  const scrollViewRef = React.useRef();
  const cardRefs = React.useRef({});

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE'
  };

  const sortRecipes = (recipes, order) => {
    if (order === 'asc') {
      return recipes.sort((a, b) => a.name[selectedLanguage].localeCompare(b.name[selectedLanguage]));
    } else if (order === 'desc') {
      return recipes.sort((a, b) => b.name[selectedLanguage].localeCompare(a.name[selectedLanguage]));
    }
    return recipes;
  };

  const searchLower = searchTerm?.toLowerCase();
  const selectedChipsLower = selectedChips.map(chip => chip.toLowerCase());
  
  const filteredRecipes = allRecipeData?.filter(recipe => {
    const recipeNameLower = recipe.name[selectedLanguage].toLowerCase();
    const ingredientsLower = recipe.ingredients[selectedLanguage].map(ingredient => ingredient.toLowerCase()).join("--");
  
    const allChipsMatch = selectedChipsLower.every(chip => 
      recipeNameLower.includes(chip) || ingredientsLower.includes(chip)
    );
  
    const searchTermMatch = searchLower ? recipeNameLower.includes(searchLower) || ingredientsLower.includes(searchLower) : true;
  
    return allChipsMatch && searchTermMatch;
  });

  const sortedRecipes = sortRecipes(filteredRecipes, sortOrder);

  const toggleExpand = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
    if (expandedCardIndex !== index && scrollViewRef.current) {
      const cardRef = cardRefs.current[index];
      if (cardRef) {
        cardRef.measureLayout(findNodeHandle(scrollViewRef.current), (x, y) => {
          scrollViewRef.current.scrollTo({ y: y, animated: true });
        });
      }
    }
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
        <ScrollView ref={scrollViewRef}>
          {sortedRecipes?.map((r, index) => (
            <View key={index} ref={ref => cardRefs.current[index] = ref}>
              <RecipeCard
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