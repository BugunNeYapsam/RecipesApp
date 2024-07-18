import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  
  const signIn = (userData) => {
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSetAllRecipes = (recipes) => {
    setAllRecipeData(recipes);
  };

  const handleSetAllCategories = (categories) => {
    setAllCategoriesData(categories);
  };

  const handleSetAllCountries = (countries) => {
    setAllCountries(countries);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        signIn,
        signOut,
        theme,
        toggleTheme,
        allRecipeData,
        setAllRecipeData: handleSetAllRecipes,
        allCategoriesData,
        setAllCategoriesData: handleSetAllCategories,
        allCountries,
        setAllCountries: handleSetAllCountries,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};