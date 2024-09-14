// AppContext.js
import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  
  const signIn = (userData) => setUser(userData);
  const signOut = () => setUser(null);
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  const addRecipe = (recipe) => {
    setSavedRecipes(prev => [...prev, recipe]);
  };

  const removeRecipe = (recipe) => {
    setSavedRecipes(prev => prev.filter(r => r.isim !== recipe.isim));
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
