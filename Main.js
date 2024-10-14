import * as React from 'react';
import { Text, StatusBar, View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Explore from "./Screens/Explore";
import SearchFood from "./Screens/SearchFood";
import Categories from "./Components/Categories";
import FeaturedRecipes from "./Components/FeaturedRecipes";
import FoodsOfCountries from './Components/FoodsOfCountries';
import Saveds from './Screens/Saveds';
import { db } from './Config/FirebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAppContext } from './Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Settings from './Screens/Settings';
import CategoryDetail from './Components/CategoryDetail';
import FoodsOfCountriesDetail from './Components/FoodsOfCountriesDetail';
import FeaturedRecipesDetail from './Components/FeaturedRecipesDetail';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { runTransaction } from "firebase/firestore";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 300;
const guidelineBaseHeight = 600;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.2) => size + (scale(size) - size) * factor;

const errorMessages = {
  "en": "Oops! It seems we're having trouble connecting right now. Please check back in a moment.",
  "tr": "Üzgünüz! Şu anda bağlantı kurmakta zorluk yaşıyoruz. Lütfen birazdan tekrar deneyin."
}

const maintenanceMessages = {
  "en": "Our app is temporarily down for maintenance. Please check back later.",
  "tr": "Uygulamamız geçici olarak bakımda. Lütfen daha sonra tekrar kontrol edin."
}

const ExploreStack = ({ retrieveAllData, updateRecipeRating }) => {
  const { selectedLanguage, languageStore, selectedCategory, selectedFeaturedRecipe, selectedCountry } = useAppContext();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Bugün Ne Yapsam?" options={{ headerShown: false }}>
        {() => <Explore retrieveAllData={retrieveAllData} />}
      </Stack.Screen>
      <Stack.Screen name={languageStore[selectedLanguage]["all_categories"]} options={{ headerShown: false }}>
        {() => (<Categories showAll />)}
      </Stack.Screen>
      {
        selectedCategory &&
        <Stack.Screen name={selectedCategory?.name[selectedLanguage]} options={{ headerShown: false }}>
          {() => (<CategoryDetail updateRecipeRating={updateRecipeRating} />)}
        </Stack.Screen>
      }
      <Stack.Screen name={languageStore[selectedLanguage]["all_featured_recipes"]} options={{ headerShown: false }}>
        {() => (<FeaturedRecipes showAll />)}
      </Stack.Screen>
      {
        selectedFeaturedRecipe && selectedFeaturedRecipe.name[selectedLanguage] &&
        <Stack.Screen name={selectedFeaturedRecipe.name[selectedLanguage]} options={{ headerShown: false }}>
          {() => (<FeaturedRecipesDetail selectedRecipe={selectedFeaturedRecipe} updateRecipeRating={updateRecipeRating} />)}
        </Stack.Screen>
      }
      <Stack.Screen name={languageStore[selectedLanguage]["all_foods_of_countries"]} options={{ headerShown: false }}>
        {() => (<FoodsOfCountries showAll />)}
      </Stack.Screen>
      {
        selectedCountry &&
        <Stack.Screen name={languageStore[selectedLanguage][selectedCountry]} options={{ headerShown: false }}>
          {() => (<FoodsOfCountriesDetail updateRecipeRating={updateRecipeRating} />)}
        </Stack.Screen>
      }
    </Stack.Navigator>
  );
};

export default function Main() {
  const { languageLoading, error, setAllCategoriesData, setAllRecipeData, setAllCountries, setFeaturedRecipes, appSettings, updateAllRecipeRatings, isDarkMode, setIsDarkMode, setSelectedLanguage, selectedLanguage, languageStore, setAllSuggestions } = useAppContext();

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "1"));
      const recipes = [];
      const ratings = {};
      
      querySnapshot.forEach((doc) => {
        const recipeData = doc.data();
        const recipeId = doc.id;

        recipes.push({ id: recipeId, ...recipeData });

        if (recipeData.rating !== undefined) {
          ratings[recipeId] = recipeData.rating;
        }
      });

      const sortedRecipes = recipes
        .filter(recipe => recipe.rating !== undefined && recipe.country.includes("tr"))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 30);

      setAllRecipeData(recipes);
      updateAllRecipeRatings(ratings);
      setFeaturedRecipes(sortedRecipes);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const getCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "2"));
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      setAllCategoriesData(categories);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const getCountries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "3"));
      const countries = [];
      querySnapshot.forEach((doc) => {
        countries.push(doc.data());
      });
      setAllCountries(countries);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const getSuggestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "4"));
      var suggestions = [];
      querySnapshot.forEach((doc) => {
        suggestions = doc.data();
      });
      setAllSuggestions(suggestions);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const retrieveAllData = () => {
    getData();
    getCategories();
    getCountries();
    getSuggestions();
  };

  React.useEffect(() => {
    const getDarkModePreference = async () => {
      try {
        const value = await AsyncStorage.getItem('darkMode');
        if (value !== null) {
          setIsDarkMode(JSON.parse(value));
        }
      } catch (e) {
        console.error('Failed to fetch dark mode preference.', e);
      }
    };

    const getLanguagePreference = async () => {
      try {
        const value = await AsyncStorage.getItem('appLanguage');
        if (value !== null) {
          setSelectedLanguage(JSON.parse(value));
        }
      } catch (e) {
        console.error('Failed to fetch language preference.', e);
      }
    };

    getDarkModePreference();
    getLanguagePreference();

    if (!appSettings?.isMaintenanceOn && !error && !languageLoading) {
      retrieveAllData();
    }
  }, [appSettings, error, languageLoading]);

  const updateRecipeRating = async (recipeId, newRating, updateSpecificRecipeRating) => {
    try {
      if (!db) throw new Error("Firestore not initialized correctly!");
  
      const recipeDocRef = doc(db, "1", recipeId.toString());
  
      await runTransaction(db, async (transaction) => {
        const recipeDoc = await transaction.get(recipeDocRef);
  
        if (!recipeDoc.exists()) {
          throw new Error("Recipe document does not exist!");
        }
  
        const recipeData = recipeDoc.data();
        const currentRatingTotal = recipeData.ratingTotal || 0;
        const currentRatingCount = recipeData.ratingCount || 0;
  
        const updatedRatingTotal = currentRatingTotal + newRating;
        const updatedRatingCount = currentRatingCount + 1;
  
        const newAverageRating = updatedRatingTotal / updatedRatingCount;
  
        transaction.update(recipeDocRef, {
          ratingTotal: updatedRatingTotal,
          ratingCount: updatedRatingCount,
          rating: newAverageRating,
        });
  
        updateSpecificRecipeRating(recipeId, newAverageRating);
      });
  
      return true;
    } catch (error) {
      console.error("Error updating rating:", error);
      return false;
    }
  };

  if (languageLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6B2346" />
      </View>
    );
  }

  if (appSettings?.isMaintenanceOn) {
    return (
      <View style={styles.center}>
        <Icon name="build" size={moderateScale(75)} color="#6B2346" />
        <Text style={[styles.errorText, { width: selectedLanguage == "tr" ? "75%" : "80%", fontSize: moderateScale(16) }]}>
          {selectedLanguage ? maintenanceMessages[selectedLanguage] : maintenanceMessages["tr"]}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Icon name="error-outline" size={moderateScale(75)} color="#6B2346" />
        <Text style={[styles.errorText, { width: "85%", fontSize: moderateScale(16) }]}>
          {selectedLanguage ? errorMessages[selectedLanguage] : errorMessages["tr"]}
        </Text>
      </View>
    );
  }

  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#2D2D2D'
    },
  };

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#EEEEEE'
    },
  };

  return (
    <>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#2D2D2D" : "#EEEEEE"} />
      <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: "#6B2346",
              borderTopWidth: 0,
              elevation: 0,
              height: moderateScale(70),
              margin: 15,
              borderRadius: 15,
              position: 'absolute',
            },
            tabBarLabelStyle: {
              fontSize: moderateScale(14),
              marginBottom: 2,
            },
            tabBarLabelPosition: 'below-icon',
            tabBarItemStyle: {
              flexDirection: 'column',
            },
          }}
        >
          <Tab.Screen
            name="Explore"
            options={{
              headerShown: false,
              tabBarItemStyle: { marginTop: 3 },
              tabBarIcon: ({ focused }) => (
                <MaterialIcons
                  name="explore"
                  color={focused ? "#ffffff" : "#ffdddd"}
                  size={moderateScale(28)}
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? "#ffffff" : "#ffdddd", fontSize: moderateScale(14), padding: 5 }}>
                  {languageStore[selectedLanguage]["explore"]}
                </Text>
              ),
            }}
          >
            {() => <ExploreStack retrieveAllData={retrieveAllData} updateRecipeRating={updateRecipeRating} />}
          </Tab.Screen>
          <Tab.Screen
            name="Ara"
            options={{
              headerShown: false,
              tabBarItemStyle: { marginTop: 3 },
              tabBarIcon: ({ focused }) => (
                <MaterialIcons name="tune" color={focused ? "#ffffff" : "#ffdddd"} size={moderateScale(28)} />
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? "#ffffff" : "#ffdddd", fontSize: moderateScale(14), padding: 5 }}>
                  {languageStore[selectedLanguage]["filter"]}
                </Text>
              ),
            }}
          >
            {() => <SearchFood updateRecipeRating={updateRecipeRating} />}
          </Tab.Screen>
          <Tab.Screen
            name="Kaydedilenler"
            options={{
              headerShown: false,
              tabBarItemStyle: { marginTop: 3 },
              tabBarIcon: ({ focused }) => (
                <MaterialIcons name="bookmark" color={focused ? "#ffffff" : "#ffdddd"} size={moderateScale(28)} />
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? "#ffffff" : "#ffdddd", fontSize: moderateScale(14), padding: 5 }}>
                  {languageStore[selectedLanguage]["saveds"]}
                </Text>
              ),
            }}
          >
            {() => <Saveds updateRecipeRating={updateRecipeRating} />}
          </Tab.Screen>
          <Tab.Screen
            name="Ayarlar"
            component={Settings}
            options={{
              headerShown: false,
              tabBarItemStyle: { marginTop: 3 },
              tabBarIcon: ({ focused }) => (
                <MaterialIcons name="settings" color={focused ? "#ffffff" : "#ffdddd"} size={moderateScale(28)} />
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? "#ffffff" : "#ffdddd", fontSize: moderateScale(14), padding: 5 }}>
                  {languageStore[selectedLanguage]["settings"]}
                </Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: "center",
    color: '#6B2346',
    fontWeight: 'bold',
    marginTop: 10,
  },
});