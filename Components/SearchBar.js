import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useAppContext } from '../Context/AppContext';

const { width: screenWidth } = Dimensions.get('window');
const isLargeScreen = screenWidth > 600;

const SearchBar = ({
  isDarkMode,
  searchTerm,
  setSearchTerm,
  onSortPress,
  sortOrder,
  onSuggestionSelect,
  selectedChips,
  onChipRemove,
  suggestionListWithoutCategory,
}) => {
  const { languageStore, selectedLanguage, selectedCategory, allSuggestions } = useAppContext();
  const [isFocused, setIsFocused] = useState(false);
  const scrollViewRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const chipWidth = isLargeScreen ? 120 : 100;

  const dynamicChipStyle = {
    backgroundColor: isDarkMode ? '#cc91a4' : '#dddfff',
    paddingVertical: isLargeScreen ? 7 : 5,
    paddingHorizontal: isLargeScreen ? 17 : 15,
    borderRadius: isLargeScreen ? 22 : 20,
    margin: isLargeScreen ? 7 : 5,
  };

  let filteredSuggestions = [];
  if (suggestionListWithoutCategory || !selectedCategory) {
    filteredSuggestions = allSuggestions['filter'][selectedLanguage].filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedChips.includes(suggestion)
    );
  } else {
    filteredSuggestions =
      allSuggestions?.[selectedCategory?.name?.en?.toLowerCase()]?.[selectedLanguage]?.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedChips.includes(suggestion)
      ) ?? [];
  }

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
          <Svg width={isLargeScreen ? 34 : 24} height={isLargeScreen ? 34 : 24} viewBox="0 0 24 24" fill="none">
            <Path d="M4 18h16v-2H4v2zm0-5h10v-2H4v2zm0-7v2h4V6H4z" fill="#555" />
          </Svg>
        );
      case 'desc':
        return (
          <Svg width={isLargeScreen ? 34 : 24} height={isLargeScreen ? 34 : 24} viewBox="0 0 24 24" fill="none">
            <Path d="M4 6v2h16V6H4zm0 5h10v2H4v-2zm0 7h4v2H4v-2z" fill="#555" />
          </Svg>
        );
      default:
        return (
          <Svg width={isLargeScreen ? 34 : 24} height={isLargeScreen ? 34 : 24} viewBox="0 0 24 24" fill="none">
            <Path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" fill="#555" />
          </Svg>
        );
    }
  };

  const handleAddChip = () => {
    if (searchTerm.trim() && !selectedChips.includes(searchTerm)) {
      onSuggestionSelect(searchTerm);
      setSearchTerm('');
    }
  };

  const renderSuggestionChip = (item, index) => (
    <TouchableOpacity key={index} style={[styles.suggestionChip, dynamicChipStyle]} onPress={() => onSuggestionSelect(item)}>
      <Text style={styles.chipText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          isFocused
            ? isDarkMode
              ? ['#cccddd', '#894d66']
              : ['#dddfff', '#ffffff']
            : isDarkMode
            ? ['#894d66', '#cccddd']
            : ['#ffffff', '#dddfff']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <MaterialIcons name="search" size={isLargeScreen ? 34 : 24} color={isDarkMode ? '#222' : '#666'} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={languageStore[selectedLanguage]['search_recipes']}
          placeholderTextColor={isDarkMode ? '#222' : '#aaa'}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            handleAddChip();
          }}
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
                <Svg width={isLargeScreen ? 30 : 18} height={isLargeScreen ? 30 : 18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18.3 5.71l-1.41-1.41L12 9.59 7.11 4.7 5.7 6.11l4.89 4.89-4.89 4.89 1.41 1.41L12 13.41l4.89 4.89 1.41-1.41-4.89-4.89 4.89-4.89z"
                    fill="#555"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {selectedChips.length > 1 && (
          <TouchableOpacity style={styles.removeAllButton} onPress={() => selectedChips.forEach(onChipRemove)}>
            <Svg width={isLargeScreen ? 34 : 24} height={isLargeScreen ? 34 : 24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm7-3.5v-5h2v5h-2zm-4 0v-5h2v5H9zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z"
                fill="#fff"
              />
            </Svg>
          </TouchableOpacity>
        )}
      </View>

      {filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsWrapper}>
          <TouchableOpacity onPress={() => scrollSuggestions('left')}>
            <Svg width={isLargeScreen ? 34 : 24} height={isLargeScreen ? 34 : 24} viewBox="0 0 24 24" fill="none">
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
            <Svg width={isLargeScreen ? 34 : 24} height={isLargeScreen ? 34 : 24} viewBox="0 0 24 24" fill="none">
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
    marginBottom: isLargeScreen ? 30 : 20,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: isLargeScreen ? 15 : 10,
    padding: isLargeScreen ? 20 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: isLargeScreen ? 3 : 2 },
    shadowOpacity: 0.15,
    shadowRadius: isLargeScreen ? 3 : 2,
    elevation: isLargeScreen ? 3 : 2,
  },
  icon: {
    marginRight: isLargeScreen ? 15 : 10,
  },
  input: {
    flex: 1,
    fontSize: isLargeScreen ? 22 : 16,
    color: '#333',
  },
  sortButton: {
    marginLeft: isLargeScreen ? 15 : 10,
  },
  chipsAndRemoveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: isLargeScreen ? 15 : 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
  },
  chip: {
    backgroundColor: '#e8e8e8',
    paddingVertical: isLargeScreen ? 7 : 5,
    paddingHorizontal: isLargeScreen ? 14 : 12,
    borderRadius: isLargeScreen ? 22 : 20,
    margin: isLargeScreen ? 7 : 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    fontSize: isLargeScreen ? 22 : 14,
    color: '#555',
  },
  chipIcon: {
    marginLeft: isLargeScreen ? 7 : 5,
  },
  removeAllButton: {
    backgroundColor: '#FF6961',
    padding: isLargeScreen ? 10 : 5,
    borderRadius: isLargeScreen ? 22 : 20,
  },
  suggestionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: isLargeScreen ? 15 : 10,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginHorizontal: isLargeScreen ? 7 : 5,
  },
  suggestionChip: {
    paddingVertical: isLargeScreen ? 7 : 5,
    paddingHorizontal: isLargeScreen ? 17 : 15,
    borderRadius: isLargeScreen ? 22 : 20,
    margin: isLargeScreen ? 7 : 5,
  },
});

export default SearchBar;