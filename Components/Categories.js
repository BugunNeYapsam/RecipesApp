import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const Categories = ({ showAll }) => {
  const navigation = useNavigation();
  const { allCategoriesData, selectedLanguage, languageStore, setSelectedCategory, isDarkMode } = useAppContext();
  const [loading, setLoading] = useState(true);
  const shimmerValue = useRef(new Animated.Value(0)).current;
  const [categoryToNavigate, setCategoryToNavigate] = useState(null);

  const dynamicSafeAreaStyle = {
    backgroundColor: isDarkMode ? '#2D2D2D' : '#EEEEEE'
  };

  const dynamicPageTitleStyle = {
    color: isDarkMode ? '#c781a4' : '#444'
  };

  const dynamicSeeAllStyle = {
    color: isDarkMode ? '#5c86ff' : '#0445ff'
  };
  
  useEffect(() => {
    if (categoryToNavigate) {
      navigation.navigate(categoryToNavigate?.name[selectedLanguage]);
      setCategoryToNavigate(null);
    }
  }, [categoryToNavigate, selectedLanguage, navigation]);

  useEffect(() => {
    if (allCategoriesData && allCategoriesData.length > 0) {
      setLoading(false);
    }

    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [allCategoriesData, shimmerValue]);

  const handleOnPressCategory = (category_object) => {
    setSelectedCategory(category_object);
    setCategoryToNavigate(category_object);
  }

  const renderPlaceholders = () => {
    const placeholders = new Array(5).fill(0);
    return placeholders.map((_, index) => (
      <View key={index} style={styles.placeholderCard}>
        <Animated.View style={[styles.placeholderImage, { opacity: shimmerValue }]} />
        <View style={styles.placeholderOverlay}>
          <Animated.View style={[styles.placeholderText, { opacity: shimmerValue }]} />
        </View>
      </View>
    ));
  };

  if (showAll) {
    return (
      <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
        <View style={styles.headerNavButton}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#c781a4' : '#444'} />
          </TouchableOpacity>
          <Text style={[styles.text, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["categories"]?.toUpperCase() || '' }</Text>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.grid}>
            {loading ? renderPlaceholders() : allCategoriesData?.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCardShowAll} onPress={() => handleOnPressCategory(category)}>
                <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
                <View style={styles.categoryOverlay}>
                  <Text style={styles.categoryName}>{category.name[selectedLanguage]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ SafeAreaView>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["categories"]}</Text>
        {
          !loading && 
          <TouchableOpacity onPress={() => navigation.navigate(languageStore[selectedLanguage]["all_categories"])}>
            <Text style={[styles.seeAll, dynamicSeeAllStyle]}>{languageStore[selectedLanguage]["see_all"]}</Text>
          </TouchableOpacity>
        }
      </View>
      <ScrollView horizontal style={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
        {loading ? renderPlaceholders() : allCategoriesData.slice(0, 5)?.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryCard} onPress={() => handleOnPressCategory(category)}>
            <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
            <View style={styles.categoryOverlay}>
              <Text style={styles.categoryName}>{category.name[selectedLanguage]}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 30,
    marginLeft: -10
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: 'blue',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  categoryCard: {
    width: (screenWidth / 3) - 30,
    height: 130,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6B2346',
  },
  categoryCardShowAll: {
    width: (screenWidth / 3) - 30,
    height: 160,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6B2346',
    marginBottom: 10
  },
  categoryImage: {
    width: '100%',
    height: '85%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  categoryName: {
    color: '#222',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    borderRadius: 50,
    paddingHorizontal: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: "25%"
  },
  placeholderCard: {
    width: (screenWidth / 3) - 30,
    height: 130,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  placeholderImage: {
    width: '100%',
    height: '75%',
    borderRadius: 10,
    backgroundColor: '#D0D0D0',
  },
  placeholderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    width: '60%',
    height: 20,
    backgroundColor: '#C0C0C0',
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Categories;