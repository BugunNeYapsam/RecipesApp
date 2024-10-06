import * as React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, findNodeHandle, LayoutAnimation, FlatList } from 'react-native';
import RecipeCard from '../Components/RecipeCard';
import SearchBar from '../Components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';

// Memoized RecipeCard component to prevent unnecessary re-renders
const MemoizedRecipeCard = React.memo(RecipeCard);

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

  const sortRecipes = React.useCallback((recipes, order) => {
    if (order === 'asc') {
      return recipes.sort((a, b) => a?.name[selectedLanguage]?.localeCompare(b?.name[selectedLanguage]));
    } else if (order === 'desc') {
      return recipes.sort((a, b) => b?.name[selectedLanguage]?.localeCompare(a?.name[selectedLanguage]));
    }
    return recipes;
  }, [selectedLanguage]);

  const searchLower = searchTerm?.toLowerCase();
  const selectedChipsLower = selectedChips.map(chip => chip.toLowerCase());

  const filteredRecipes = React.useMemo(() => {
    return allRecipeData?.filter(recipe => {
      const recipeNameLower = recipe.name[selectedLanguage].toLowerCase();
      const ingredientsLower = recipe.ingredients[selectedLanguage].map(ingredient => ingredient.toLowerCase()).join("--");

      const allChipsMatch = selectedChipsLower.every(chip => 
        recipeNameLower.includes(chip) || ingredientsLower.includes(chip)
      );

      const searchTermMatch = searchLower ? recipeNameLower.includes(searchLower) || ingredientsLower.includes(searchLower) : true;

      return allChipsMatch && searchTermMatch;
    });
  }, [allRecipeData, selectedLanguage, selectedChipsLower, searchLower]);

  const sortedRecipes = sortRecipes(filteredRecipes, sortOrder);

  const toggleExpand = React.useCallback((index) => {
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

  const handleSort = React.useCallback(() => {
    setSortOrder(prevOrder => {
      if (prevOrder === 'none') return 'asc';
      if (prevOrder === 'asc') return 'desc';
      return 'none';
    });
  }, []);

  const handleSuggestionSelect = React.useCallback((suggestion) => {
    setSelectedChips(prevChips => [...prevChips, suggestion]);
    setSearchTerm('');
  }, []);

  const handleChipRemove = React.useCallback((chip) => {
    setSelectedChips(prevChips => prevChips.filter(c => c !== chip));
  }, []);

  const handleSave = React.useCallback((recipe, isSaved) => {
    if (isSaved) {
      addRecipe(recipe);
    } else {
      removeRecipe(recipe);
    }
  }, [addRecipe, removeRecipe]);

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderRecipe = React.useCallback(({ item, index }) => (
    <View key={index} ref={ref => cardRefs.current[index] = ref}>
      <MemoizedRecipeCard
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
  ), [expandedCardIndex, selectedLanguage, handleSave, toggleExpand, savedRecipes, updateRecipeRating]);

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
        <FlatList
          ref={scrollViewRef}
          data={sortedRecipes}
          renderItem={renderRecipe}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          contentContainerStyle={{ paddingBottom: "20%" }}
        />
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