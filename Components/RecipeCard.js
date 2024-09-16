import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../Context/AppContext';

const RecipeCard = ({ recipeID, foodName, ingredients, recipeSteps, expanded, toggleExpand, saved, onSave, rating, updateRecipeRating }) => {
  const { recipeRatings, updateSpecificRecipeRating } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const successOpacity = useRef(new Animated.Value(0)).current;
  const failureOpacity = useRef(new Animated.Value(0)).current;

  const saveRatingToDevice = async (rating) => {
    try {
      await AsyncStorage.setItem(`rating_${foodName}`, JSON.stringify(rating));
    } catch (error) {
      console.error('Failed to save rating:', error);
      throw error;
    }
  };

  const handleRating = async (recipe_id, newRating) => {
    const validRating = Math.max(0, Math.min(5, newRating));
    setLoading(true);
  
    try {
      const dbUpdateResult = await updateRecipeRating(recipe_id, newRating, updateSpecificRecipeRating);
  
      if (dbUpdateResult) {
        await saveRatingToDevice(validRating);
        triggerSuccessAnimation();
      } else {
        triggerFailureAnimation();
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      triggerFailureAnimation();
    } finally {
      setLoading(false);
    }
  };

  const triggerSuccessAnimation = () => {
    setShowSuccess(true);
    Animated.sequence([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(successOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSuccess(false));
  };

  const triggerFailureAnimation = () => {
    setShowFailure(true);
    Animated.sequence([
      Animated.timing(failureOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(failureOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setShowFailure(false));
  };

  const renderStars = (recipe_id) => {
    const current_rating = recipeRatings[parseInt(recipe_id)] || 0;
    const stars = [];
    const fullStars = Math.floor(current_rating);
    const hasHalfStar = current_rating % 1 !== 0;
  
    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <TouchableOpacity key={`full-${i}`} onPress={() => handleRating(parseInt(recipe_id), i)}>
          <MaterialIcons name="star" size={24} color="#FFC107" />
        </TouchableOpacity>
      );
    }
  
    if (hasHalfStar) {
      stars.push(
        <TouchableOpacity key="half-star" onPress={() => handleRating(parseInt(recipe_id), fullStars + 1)}>
          <MaterialIcons name="star-half" size={24} color="#FFC107" />
        </TouchableOpacity>
      );
    }
  
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(
        <TouchableOpacity key={`empty-${i}`} onPress={() => handleRating(parseInt(recipe_id), i + 1)}>
          <MaterialIcons name="star-border" size={24} color="#FFC107" />
        </TouchableOpacity>
      );
    }
  
    return stars;
  };
  
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
            <MaterialIcons
              name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="#888"
            />
            <Text style={styles.title}>{foodName}</Text>
            <TouchableOpacity onPress={() => onSave(!saved)}>
              <MaterialIcons
                name={saved ? 'bookmark' : 'bookmark-border'}
                size={24}
                color={'#888'}
              />
            </TouchableOpacity>
          </View>

          {expanded && (
            <>
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

              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{recipeRatings[recipeID]?.toFixed(1)}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(recipeID)}
                </View>

                {loading ? (
                  <ActivityIndicator style={{marginLeft: 15}} size="small" color="#FFC107" />
                ) : showSuccess ? (
                  <Animated.View style={[styles.successTick, { opacity: successOpacity }]}>
                    <Ionicons name="checkmark-circle" size={30} color="green" />
                  </Animated.View>
                ) : showFailure ? (
                  <Animated.View style={[styles.failureTick, { opacity: failureOpacity }]}>
                    <Ionicons name="close-circle" size={30} color="red" />
                  </Animated.View>
                ) : null}
              </View>
            </>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  successTick: {
    marginLeft: 10,
  },
  failureTick: {
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 10,
    color: '#555',
    fontWeight: "500"
  },
});

export default RecipeCard;