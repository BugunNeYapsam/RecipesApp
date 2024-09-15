import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const RecipeCard = ({ foodName, ingredients, recipeSteps, expanded, toggleExpand, saved, onSave }) => {
  return (
    <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
      <View style={[styles.card, expanded && styles.cardExpanded]}>
        <LinearGradient
          colors={['#dddfff', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            {/* Chevron Icon for Expand/Collapse */}
            <MaterialIcons
              name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="#888"
            />
            {/* Title and Save/Unsave Icon */}
            <Text style={styles.title}>{foodName}</Text>
            <TouchableOpacity onPress={() => onSave(!saved)}>
              <MaterialIcons
                name={saved ? 'bookmark' : 'bookmark-border'}
                size={24}
                color={saved && '#888'}
              />
            </TouchableOpacity>
          </View>
          {expanded && (
            <View style={styles.contentContainer}>
              <Text style={styles.subtitle}>Ingredients:</Text>
              <View style={styles.ingredientsList}>
                {ingredients.map((ingredient, index) => (
                  <Text key={index} style={styles.ingredientItem}>
                    • {ingredient}
                  </Text>
                ))}
              </View>
              <Text style={styles.subtitle}>Recipe:</Text>
              <View style={styles.stepsList}>
                {recipeSteps.map((step, index) => (
                  <View key={index} style={styles.stepItemContainer}>
                    <Text style={styles.stepNumber}>{index + 1}.</Text>
                    <Text style={styles.stepText}>{step.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginHorizontal: 10,
  },
  contentContainer: {
    borderRadius: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  ingredientsList: {
    marginBottom: 10,
  },
  ingredientItem: {
    fontSize: 16,
    color: '#333',
  },
  stepsList: {
    marginBottom: 10,
  },
  stepItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default RecipeCard;