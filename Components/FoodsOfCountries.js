import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, Animated, Easing, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FoodsOfCountries = ({ showAll }) => {
  const navigation = useNavigation();
  const { allCountries, selectedLanguage, languageStore, setSelectedCountry, isDarkMode } = useAppContext();
  const [loading, setLoading] = useState(true);
  const shimmerValue = useRef(new Animated.Value(0)).current;
  const [countryToNavigate, setCountryToNavigate] = useState(null);

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
    if (countryToNavigate) {
      navigation.navigate(languageStore[selectedLanguage][countryToNavigate]);
      setCountryToNavigate(null);
    }
  }, [countryToNavigate, selectedLanguage, navigation]);

  useEffect(() => {
    if (allCountries && allCountries.length > 0) {
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
  }, [allCountries, shimmerValue]);

  const handleOnPressCountry = (country) => {
    setSelectedCountry(country.code);
    setCountryToNavigate(country.code);
  };

  const renderPlaceholders = () => {
    const placeholders = new Array(5).fill(0);
    return placeholders.map((_, index) => (
      <View key={index} style={[styles.placeholderCard, { width: cardWidth, height: cardHeight }]}>
        <Animated.View style={[styles.placeholderImage, { opacity: shimmerValue }]} />
        <View style={styles.placeholderOverlay}>
          <Animated.View style={[styles.placeholderText, { opacity: shimmerValue }]} />
        </View>
      </View>
    ));
  };

  const calculateCardSize = () => {
    const cardWidth = screenWidth < 600 ? (screenWidth / 3.75) : (screenWidth / 3.75);
    const cardHeight = screenHeight < 1000 ? 90 : 150;
    return { cardWidth, cardHeight };
  };

  const calculateFontSize = () => {
    return screenWidth < 600 ? 16 : 22;
  };

  const { cardWidth, cardHeight } = calculateCardSize();
  const fontSize = calculateFontSize();

  if (showAll) {
    return (
      <SafeAreaView style={[styles.safeArea, dynamicSafeAreaStyle]}>
        <View style={styles.headerNavButton}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#c781a4' : '#444'} />
          </TouchableOpacity>
          <Text style={[styles.text, dynamicPageTitleStyle, { fontSize }]}>
            {languageStore[selectedLanguage]["foods_of_countries"]?.toUpperCase() || ''}
          </Text>
        </View>
        <FlatList
          data={
            [...allCountries]
            .sort((a, b) => {
              if (a.code == "other") return 1;
              if (b.code == "other") return -1;
              return showAll ? languageStore[selectedLanguage][a.code].localeCompare(languageStore[selectedLanguage][b.code]) : 0; }
            )
            .filter((country) => country?.show)
          }
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.countryCard, { width: cardWidth, height: cardHeight }]} onPress={() => handleOnPressCountry(item)}>
              <Image source={{ uri: item.imageUrl }} style={styles.countryFlag} />
              <View style={styles.countryOverlay}>
                <Text style={[styles.countryName, { fontSize }]}>{languageStore[selectedLanguage][item.code]}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={renderPlaceholders}
        />
      </SafeAreaView>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, dynamicPageTitleStyle, { fontSize: fontSize }]}>{languageStore[selectedLanguage]["foods_of_countries"]}</Text>
        {
          !loading && 
          <TouchableOpacity onPress={() => navigation.navigate(languageStore[selectedLanguage]["all_foods_of_countries"])}>
            <Text style={[styles.seeAll, dynamicSeeAllStyle, { fontSize: fontSize * 0.9 }]}>{languageStore[selectedLanguage]["see_all"]}</Text>
          </TouchableOpacity>
        }
      </View>
      <ScrollView horizontal style={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
        {loading ? renderPlaceholders() : allCountries?.slice(0, 5).filter((country) => country?.show).map((country, index) => (
          <TouchableOpacity key={index} style={[styles.countryCard, { marginRight: 10, width: cardWidth, height: cardHeight }]} onPress={() => handleOnPressCountry(country)}>
            <Image source={{ uri: country.imageUrl }} style={styles.countryFlag} />
            <View style={styles.countryOverlay}>
              <Text style={[styles.countryName, { fontSize: fontSize * 0.9 }]}>{languageStore[selectedLanguage][country.code]}</Text>
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
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  headerNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 30,
    marginLeft: -10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: 'blue',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  countryCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B2346',
  },
  countryFlag: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  countryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  countryName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grid: {
    paddingBottom: '25%'
  },
  placeholderCard: {
    marginRight: 10,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  placeholderImage: {
    width: '100%',
    height: '80%',
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
    marginTop: 10,
    height: 15,
    backgroundColor: '#C0C0C0',
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default FoodsOfCountries;