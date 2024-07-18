import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons'; // Example of using MaterialIcons from expo/vector-icons

const RecipeCard = ({ foodName, ingredients, recipeSteps, imageUrl, expanded, toggleExpand }) => {
  return (
    <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
      <View style={[styles.card, expanded && styles.cardExpanded]}>
        <LinearGradient
          colors={['#d3d3d3', '#ffffff']} // Updated gradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{foodName}</Text>
            <MaterialIcons
              name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="#888"
            />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    overflow: 'hidden', // Ensures the content respects the border radius
  },
  gradient: {
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Changed to black for readability
  },
  contentContainer: {
    borderRadius: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333', // Darker color for readability
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333', // Darker color for readability
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
