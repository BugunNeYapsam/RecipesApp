import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguagesFile from "../Config/Languages.json";

export const AppContext = createContext({});

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
  const [languageStore, setLanguageStore] = useState(LanguagesFile);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedFeaturedRecipe, setSelectedFeaturedRecipe] = useState(undefined);
  const [selectedCountry, setSelectedCountry] = useState(undefined);
  
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
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

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
    const updatedRecipes = savedRecipes.filter(r => r.isim !== recipe.isim);
    setSavedRecipes(updatedRecipes);
    try {
      await AsyncStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    } catch (error) {
      console.error('Failed to remove recipe', error);
    }
  };

  return (
    <AppContext.Provider value={{
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
      selectedCategory,
      setSelectedCategory,
      selectedFeaturedRecipe,
      setSelectedFeaturedRecipe,
      selectedCountry,
      setSelectedCountry
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);