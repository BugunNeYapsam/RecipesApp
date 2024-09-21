import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import RecipeCard from '../Components/RecipeCard';
import SearchBar from '../Components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const FoodsOfCountriesDetail = ({ updateRecipeRating }) => {
  const { isDarkMode, selectedLanguage, allRecipeData, savedRecipes, addRecipe, removeRecipe, languageStore, selectedCountry, setSelectedCountry } = useAppContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedCardIndex, setExpandedCardIndex] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('none');
  const [selectedChips, setSelectedChips] = React.useState([]);
  
  const navigation = useNavigation();
  
  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE'
  };

  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#7f405f'
  };

  React.useEffect(() => {
    return () => {
      setSelectedCountry(undefined);
    }
  }, []);

  const sortRecipes = (recipes, order) => {
    if (order === 'asc') {
      return recipes.sort((a, b) => a.isim.localeCompare(b.isim));
    } else if (order === 'desc') {
      return recipes.sort((a, b) => b.isim.localeCompare(a.isim));
    }
    return recipes;
  };

  const filteredRecipes = allRecipeData?.filter(d => d.country.includes(selectedCountry)).filter(r => {
    const searchInRecipe = (text) => r.isim.toLowerCase().includes(text) || r.malzemeler.join("--").toLowerCase().includes(text);
  
    if (selectedChips.length > 0) {
      return selectedChips.some(chip => searchInRecipe(chip.toLowerCase()));
    }
  
    return searchInRecipe(searchTerm.toLowerCase());
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

  return (
    <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#c781a4' : '#7f405f'} />
        </TouchableOpacity>
        <Text style={[styles.text, dynamicPageTitleStyle]}>{languageStore[selectedLanguage][selectedCountry]?.toUpperCase() || '' }</Text>
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

export default FoodsOfCountriesDetail;