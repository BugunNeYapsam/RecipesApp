import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const suggestionsList = [
  "Spaghetti", "Chicken Curry", "Beef Stew", "Tacos", "Salad", "Pancakes", "Sushi",
  "Pizza", "Biryani", "Burger", "Fried Rice", "Omelette", "Lasagna", "Soup",
  "Fish Tacos", "Grilled Cheese", "Falafel", "Ramen", "Paella", "Chicken Wings"
];

const SearchBar = ({ searchTerm, setSearchTerm, onSortPress, sortOrder, onSuggestionSelect, selectedChips, onChipRemove }) => {
  const [isFocused, setIsFocused] = useState(false);
  const scrollViewRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const chipWidth = 100; // Approximate width of each chip, you can adjust based on your design

  const filteredSuggestions = suggestionsList.filter(
    suggestion =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedChips.includes(suggestion)
  );

  const scrollSuggestions = (direction) => {
    if (scrollViewRef.current) {
      const newScrollX = direction === 'left' ? scrollX - chipWidth : scrollX + chipWidth;
      scrollViewRef.current.scrollTo({ x: newScrollX, animated: true });
      setScrollX(newScrollX);
    }
  };

  const getSortIcon = () => {
    switch (sortOrder) {
      case 'asc':
        return (
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M4 18h16v-2H4v2zm0-5h10v-2H4v2zm0-7v2h4V6H4z" fill="#555" />
          </Svg>
        );
      case 'desc':
        return (
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M4 6v2h16V6H4zm0 5h10v2H4v-2zm0 7h4v2H4v-2z" fill="#555" />
          </Svg>
        );
      default:
        return (
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" fill="#555" />
          </Svg>
        );
    }
  };

  const renderSuggestionChip = (item, index) => (
    <TouchableOpacity key={index} style={styles.suggestionChip} onPress={() => onSuggestionSelect(item)}>
      <Text style={styles.chipText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isFocused ? ['#f0f0f0', '#f0f0f0'] : ['#e0e0e0', '#f0f0f0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <MaterialIcons name="search" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search recipes..."
          placeholderTextColor="#aaa"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
          {getSortIcon()}
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.chipsAndRemoveContainer}>
        <View style={styles.chipsContainer}>
          {selectedChips.map((chip, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
              <TouchableOpacity onPress={() => onChipRemove(chip)}>
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Path d="M18.3 5.71l-1.41-1.41L12 9.59 7.11 4.7 5.7 6.11l4.89 4.89-4.89 4.89 1.41 1.41L12 13.41l4.89 4.89 1.41-1.41-4.89-4.89 4.89-4.89z" fill="#555" />
                </Svg>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {selectedChips.length > 1 && (
          <TouchableOpacity style={styles.removeAllButton} onPress={() => selectedChips.forEach(onChipRemove)}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm7-3.5v-5h2v5h-2zm-4 0v-5h2v5H9zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" fill="#fff" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>

      {filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsWrapper}>
          <TouchableOpacity onPress={() => scrollSuggestions('left')}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" fill="#888" />
            </Svg>
          </TouchableOpacity>

          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsRow}
            onScroll={(event) => setScrollX(event.nativeEvent.contentOffset.x)}
            scrollEventThrottle={16}
          >
            {filteredSuggestions.map(renderSuggestionChip)}
          </ScrollView>

          <TouchableOpacity onPress={() => scrollSuggestions('right')}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z" fill="#888" />
            </Svg>
          </TouchableOpacity>
        </View>
      )}
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
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
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
    backgroundColor: '#e8e8e8', // Light gray color for the selected chips
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20, // Rounded appearance for minimal look
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 14,
    color: '#555', // Darker gray for text color
  },
  chipIcon: {
    marginLeft: 5,
  },
  removeAllButton: {
    backgroundColor: '#FF6961', // Soft red color for the Remove All button
    padding: 5,
    borderRadius: 20, // Rounded appearance
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
    backgroundColor: '#d0d0d0', // Slightly darker gray for the suggestion chips
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20, // Rounded appearance
    margin: 5,
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SearchBar;