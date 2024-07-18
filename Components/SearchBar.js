import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg'; // Correct import

const SearchBar = ({ searchTerm, setSearchTerm, onSortPress, sortOrder }) => {
  const [isFocused, setIsFocused] = useState(false);

  const getSortIcon = () => {
    switch (sortOrder) {
      case 'asc':
        return (
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M4 18h16v-2H4v2zm0-5h10v-2H4v2zm0-7v2h4V6H4z" fill="#888" />
          </Svg>
        );
      case 'desc':
        return (
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M4 6v2h16V6H4zm0 5h10v2H4v-2zm0 7h4v2H4v-2z" fill="#888" />
          </Svg>
        );
      default:
        return (
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" fill="#888" />
          </Svg>
        );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isFocused ? ['#ffffff', '#ffffff'] : ['#d3d3d3', '#ffffff']} // Change gradient based on focus
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <MaterialIcons name="search" size={24} color="#888" style={styles.icon} />
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
});

export default SearchBar;