import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, findNodeHandle, LayoutAnimation, FlatList } from 'react-native';
import RecipeCard from '../Components/RecipeCard';
import SearchBar from '../Components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const MemoizedRecipeCard = React.memo(RecipeCard);

const CategoryDetail = ({ updateRecipeRating }) => {
  const { isDarkMode, selectedLanguage, allRecipeData, savedRecipes, addRecipe, removeRecipe, selectedCategory, setSelectedCategory } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [sortOrder, setSortOrder] = useState('none');
  const [selectedChips, setSelectedChips] = useState([]);

  const scrollViewRef = useRef();
  const cardRefs = useRef({});

  const navigation = useNavigation();

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE'
  };

  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#7f405f'
  };

  React.useEffect(() => {
    return () => {
      setSelectedCategory(undefined);
    };
  }, [setSelectedCategory]);

  const sortRecipes = useCallback((recipes, order) => {
    if (order === 'asc') {
      return recipes.sort((a, b) => a.name[selectedLanguage].localeCompare(b.name[selectedLanguage]));
    } else if (order === 'desc') {
      return recipes.sort((a, b) => b.name[selectedLanguage].localeCompare(a.name[selectedLanguage]));
    }
    return recipes;
  }, [selectedLanguage]);

  const filteredRecipes = useMemo(() => {
    return allRecipeData?.filter(d => d.category === selectedCategory?.name["en"]).filter(r => {
      const searchInRecipe = (text) => {
        return r.name[selectedLanguage].toLowerCase().includes(text) || r.ingredients[selectedLanguage].join("--").toLowerCase().includes(text);
      };

      if (selectedChips.length > 0) {
        return selectedChips.some(chip => searchInRecipe(chip.toLowerCase()));
      }

      return searchInRecipe(searchTerm.toLowerCase());
    });
  }, [allRecipeData, selectedCategory, selectedChips, searchTerm, selectedLanguage]);

  const sortedRecipes = useMemo(() => sortRecipes(filteredRecipes, sortOrder), [filteredRecipes, sortOrder, sortRecipes]);

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

  const handleSort = useCallback(() => {
    setSortOrder(prevOrder => {
      if (prevOrder === 'none') return 'asc';
      if (prevOrder === 'asc') return 'desc';
      return 'none';
    });
  }, []);

  const handleSuggestionSelect = useCallback((suggestion) => {
    setSelectedChips(prevChips => [...prevChips, suggestion]);
    setSearchTerm('');
  }, []);

  const handleChipRemove = useCallback((chip) => {
    setSelectedChips(prevChips => prevChips.filter(c => c !== chip));
  }, []);

  const handleSave = useCallback((recipe, isSaved) => {
    if (isSaved) {
      addRecipe(recipe);
    } else {
      removeRecipe(recipe);
    }
  }, [addRecipe, removeRecipe]);

  const renderRecipe = useCallback(({ item, index }) => (
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#c781a4' : '#7f405f'} />
        </TouchableOpacity>
        <Text style={[styles.text, dynamicPageTitleStyle]}>{selectedCategory?.name[selectedLanguage]?.toUpperCase() || ''}</Text>
      </View>
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
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 30,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: "20%",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CategoryDetail;