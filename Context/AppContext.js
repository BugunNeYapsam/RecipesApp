import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Config/FirebaseConfig';

export const AppContext = createContext({});

const getLanguages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "5"));
    let langs = {};
    querySnapshot.forEach((doc) => {
      langs[doc.id] = doc.data();
    });
    return langs;
  } catch (error) {
    console.error('Failed to fetch languages:', error);
    throw error;
  }
};

const getAppSettings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "6"));
    let settings = {};
    querySnapshot.forEach((doc) => {
      settings = doc.data();
    });
    return settings;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipeRatings, setRecipeRatings] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [languageStore, setLanguageStore] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedFeaturedRecipe, setSelectedFeaturedRecipe] = useState(undefined);
  const [selectedCountry, setSelectedCountry] = useState(undefined);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [languageLoading, setLanguageLoading] = useState(true);
  const [error, setError] = useState(false);
  const [appSettings, setAppSettings] = useState({});

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setLanguageLoading(true);
        setError(false);
        const langs = await getLanguages();
        setLanguageStore(langs);
      } catch (error) {
        setError(true);
      } finally {
        setLanguageLoading(false);
      }
    };

    const loadAppSettings = async () => {
      try {
        const settings = await getAppSettings();
        setAppSettings(settings);
      } catch (error) {
        setError(true);
      }
    };

    loadLanguages();
    loadAppSettings();
  }, []);

  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('savedRecipes');
        if (storedRecipes) {
          setSavedRecipes(JSON.parse(storedRecipes));
        }
      } catch (error) {
        console.error('Failed to load saved recipes', error);
      }
    };
    loadSavedRecipes();
  }, []);

  const updateSpecificRecipeRating = (recipeId, newRating) => {
    setRecipeRatings((prevRatings) => ({
      ...prevRatings,
      [recipeId]: newRating,
    }));
  };

  const updateAllRecipeRatings = (ratings) => {
    setRecipeRatings(ratings);
  };

  const signIn = (userData) => setUser(userData);
  const signOut = () => setUser(null);

  const toggleTheme = () => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));

  const addRecipe = async (recipe) => {
    const updatedRecipes = [...savedRecipes, recipe];
    setSavedRecipes(updatedRecipes);
    try {
      await AsyncStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    } catch (error) {
      console.error('Failed to save recipe', error);
    }
  };

  const removeRecipe = async (recipe) => {
    const updatedRecipes = savedRecipes.filter((r) => r.id !== recipe.id);
    setSavedRecipes(updatedRecipes);
    try {
      await AsyncStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    } catch (error) {
      console.error('Failed to remove recipe', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        savedRecipes,
        addRecipe,
        removeRecipe,
        user,
        signIn,
        signOut,
        theme,
        toggleTheme,
        allRecipeData,
        setAllRecipeData,
        featuredRecipes,
        setFeaturedRecipes,
        allCategoriesData,
        setAllCategoriesData,
        allCountries,
        setAllCountries,
        recipeRatings,
        updateSpecificRecipeRating,
        updateAllRecipeRatings,
        isDarkMode,
        setIsDarkMode,
        selectedLanguage,
        setSelectedLanguage,
        languageStore,
        setLanguageStore,
        selectedCategory,
        setSelectedCategory,
        selectedFeaturedRecipe,
        setSelectedFeaturedRecipe,
        selectedCountry,
        setSelectedCountry,
        allSuggestions,
        setAllSuggestions,
        languageLoading,
        error,
        appSettings,
        setAppSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);