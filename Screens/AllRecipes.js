import * as React from 'react';
import { ScrollView, View, StyleSheet, TextInput, SafeAreaView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RecipeCard from '../Components/RecipeCard';
import SearchBar from '../Components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';

export default function AllRecipes(props) {
  const { allRecipeData } = useAppContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedCardIndex, setExpandedCardIndex] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('none');
  const [selectedChips, setSelectedChips] = React.useState([]);

  const sortRecipes = (recipes, order) => {
    if (order === 'asc') {
      return recipes.sort((a, b) => a.isim.localeCompare(b.isim));
    } else if (order === 'desc') {
      return recipes.sort((a, b) => b.isim.localeCompare(a.isim));
    }
    return recipes;
  };

  const filteredRecipes = allRecipeData?.filter(r => 
    selectedChips.length > 0 
      ? selectedChips.some(chip => r.isim.toLowerCase().includes(chip.toLowerCase()))
      : r.isim.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#bbd0c4', '#a1d0c4', '#bbd0c4']}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSortPress={handleSort}
            sortOrder={sortOrder}
            onSuggestionSelect={handleSuggestionSelect}
            selectedChips={selectedChips}
            onChipRemove={handleChipRemove}
          />
          <ScrollView>
            {sortedRecipes?.map((r, index) => (
              <RecipeCard
                key={index}
                foodName={r.isim}
                ingredients={r.malzemeler}
                recipeSteps={r.tarif}
                imageUrl={"https://picsum.photos/200/300"}
                expanded={expandedCardIndex === index}
                toggleExpand={() => toggleExpand(index)}
              />
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
});