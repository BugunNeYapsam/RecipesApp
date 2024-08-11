import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const suggestionsList = [
  "Spaghetti", "Chicken Curry", "Beef Stew", "Tacos", "Salad", "Pancakes", "Sushi",
  "Pizza", "Biryani", "Burger", "Fried Rice", "Omelette", "Lasagna", "Soup",
  "Fish Tacos", "Grilled Cheese", "Falafel", "Ramen", "Paella", "Chicken Wings"
];

const SearchBar = ({ searchTerm, setSearchTerm, onSortPress, sortOrder, onSuggestionSelect, selectedChips, onChipRemove }) => {
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions = suggestionsList.filter(
    suggestion =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedChips.includes(suggestion)
  );

  const getSortIcon = () => {
    switch (sortOrder) {
      case 'asc':
        return (
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M4 18h16v-2H4v2zm0-5h10v-2H4v2zm0-7v2h4V6H4z" fill="#888" />
          </Svg>
        );
      case 'desc':
        return (
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M4 6v2h16V6H4zm0 5h10v2H4v-2zm0 7h4v2H4v-2z" fill="#888" />
          </Svg>
        );
      default:
        return (
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" fill="#888" />
          </Svg>
        );
    }
  };

  const renderSuggestionChip = ({ item }) => (
    <TouchableOpacity style={styles.suggestionChip} onPress={() => onSuggestionSelect(item)}>
      <Text style={styles.chipText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderSuggestions = () => (
    <View style={styles.suggestionsWrapper}>
      {/* Left Arrow */}
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" fill="#888" />
      </Svg>

      <FlatList
        data={filteredSuggestions}
        renderItem={renderSuggestionChip}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsRow}
      />

      {/* Right Arrow */}
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z" fill="#888" />
      </Svg>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isFocused ? ['#ffffff', '#ffffff'] : ['#d3d3d3', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={styles.icon}>
          <Path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z" fill="#888" />
        </Svg>
        <TextInput
          style={styles.input}
          placeholder="Search recipes..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
          {getSortIcon()}
        </TouchableOpacity>
      </LinearGradient>

      {/* Render Selected Chips and Delete Icon */}
      <View style={styles.chipsAndRemoveContainer}>
        {/* Chips */}
        <View style={styles.chipsContainer}>
          {selectedChips.map((chip, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
              <TouchableOpacity onPress={() => onChipRemove(chip)}>
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Path d="M19 13H5v-2h14v2z" fill="#333" />
                </Svg>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Delete Icon */}
        {selectedChips.length > 1 && (
          <TouchableOpacity style={styles.removeAllButton} onPress={() => selectedChips.forEach(onChipRemove)}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm7-3.5v-5h2v5h-2zm-4 0v-5h2v5H9zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" fill="#fff" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>

      {/* Render Suggestions as Chips */}
      {filteredSuggestions.length > 0 && renderSuggestions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sortButton: {
    marginLeft: 10,
  },
  chipsAndRemoveContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically align chips and remove button
    justifyContent: 'space-between', // Space between chips and remove button
    marginTop: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1, // Chips take up available space
  },
  chip: {
    backgroundColor: '#D3D3D3', // Light gray color for the selected chips
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10, // Rounded square appearance
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 14,
    color: '#333', // Dark text color
  },
  chipIcon: {
    marginLeft: 5,
  },
  removeAllButton: {
    backgroundColor: '#FF5722', // Orange color for the Remove All button
    padding: 5,
    borderRadius: 10, // Rounded square appearance
  },
  suggestionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginHorizontal: 5, // Space for the arrows
  },
  suggestionChip: {
    backgroundColor: '#A9A9A9', // Slightly darker gray for the suggestion chips
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10, // Rounded square appearance
    margin: 5,
  },
  chipText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default SearchBar;
