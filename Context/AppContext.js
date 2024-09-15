import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Load saved recipes from AsyncStorage when the app starts
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
      allCategoriesData,
      setAllCategoriesData,
      allCountries,
      setAllCountries
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);