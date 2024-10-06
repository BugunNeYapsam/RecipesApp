import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

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
          <Text style={[styles.text, dynamicPageTitleStyle]}>
            {languageStore[selectedLanguage]["foods_of_countries"]?.toUpperCase() || ''}
          </Text>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.grid}>
            {loading
              ? renderPlaceholders()
              : [...allCountries]
                  .sort((a, b) => {
                    if (a.code == "other") return 1;
                    if (b.code == "other") return -1;
                    return showAll ? languageStore[selectedLanguage][a.code].localeCompare(languageStore[selectedLanguage][b.code]) : 0; }
                  )
                  .filter((country) => country?.show)
                  .map((country, index) => (
                    <TouchableOpacity key={index} style={styles.countryCard} onPress={() => handleOnPressCountry(country)}>
                      <Image source={{ uri: country.imageUrl }} style={styles.countryFlag} />
                      <View style={styles.countryOverlay}>
                        <Text style={styles.countryName}>{languageStore[selectedLanguage][country.code]}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, dynamicPageTitleStyle]}>{languageStore[selectedLanguage]["foods_of_countries"]}</Text>
        {
          !loading && 
          <TouchableOpacity onPress={() => navigation.navigate(languageStore[selectedLanguage]["all_foods_of_countries"])}>
            <Text style={[styles.seeAll, dynamicSeeAllStyle]}>{languageStore[selectedLanguage]["see_all"]}</Text>
          </TouchableOpacity>
        }
      </View>
      <ScrollView horizontal style={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
        {loading ? renderPlaceholders() : allCountries?.slice(0, 5).filter((country) => country?.show).map((country, index) => (
          <TouchableOpacity key={index} style={styles.countryCard} onPress={() => handleOnPressCountry(country)}>
            <Image source={{ uri: country.imageUrl }} style={styles.countryFlag} />
            <View style={styles.countryOverlay}>
              <Text style={styles.countryName}>{languageStore[selectedLanguage][country.code]}</Text>
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
    marginVertical: 10,
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
    width: (screenWidth / 4),
    height: 85,
    marginRight: 10,
    paddingBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B2346',
  },
  countryFlag: {
    marginTop: -15,
    width: '100%',
    height: '90%',
  },
  countryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryName: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    backgroundColor: "#D3D3D3",
    width: "100%",
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: "25%"
  },
  placeholderCard: {
    width: (screenWidth / 4),
    height: 85,
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