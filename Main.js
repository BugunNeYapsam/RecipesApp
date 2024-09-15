import * as React from 'react';
import {  Dimensions, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Explore from "./Screens/Explore";
import SearchFood from "./Screens/SearchFood";
import Categories from "./Components/Categories";
import FeaturedRecipes from "./Components/FeaturedRecipes";
import VideoRecipes from "./Components/VideoRecipes";
import InAppPromotions from './Components/InAppPromotions';
import FoodsOfCountries from './Components/FoodsOfCountries';
import Saveds from './Screens/Saveds';
import { collection, getDocs } from "firebase/firestore";
import { db } from './Config/FirebaseConfig';
import { useAppContext } from './Context/AppContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Settings from './Screens/Settings';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ExploreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Bugün Ne Yapsam?" component={Explore} options={{ headerShown: false }} />
      <Stack.Screen name="Tüm Kategoriler">
        {() => (<Categories showAll />)}
      </Stack.Screen>
      <Stack.Screen name="Tüm Öne Çıkan Tarifler">
        {() => (<FeaturedRecipes showAll />)}
      </Stack.Screen>
      <Stack.Screen name="Tüm Video Tarifler">
        {() => (<VideoRecipes showAll />)}
      </Stack.Screen>
      <Stack.Screen name="Tüm Ülkeler">
        {() => (<FoodsOfCountries showAll />)}
      </Stack.Screen>
      <Stack.Screen name="Tüm Promosyonlar">
        {() => (<InAppPromotions showAll />)}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default function Main() {
  const { setAllCategoriesData, setAllRecipeData, setAllCountries } = useAppContext();

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "1"));
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push(doc.data());
      });
      setAllRecipeData(recipes);
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

  const updateRecipeRating = async (recipeId, newRating) => {
    try {
      const recipeDocRef = doc(db, "1", recipeId);
      console.log(recipeDocRef);
      await updateDoc(recipeDocRef, { rating: newRating });
      console.log("Rating updated successfully");
    } catch (error) {
      console.error("Error updating rating: ", error);
    }
  };

  React.useEffect(() => {
    getData();
    getCategories();
    getCountries();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#6B2346",
            borderTopWidth: 0,
            elevation: 0,
            height: 65,
            margin: 15, 
            borderRadius: 15,
            position: 'absolute'
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 2,
          },
        }}
      >
        <Tab.Screen
          name="Keşfet"
          component={ExploreStack}
          options={{
            headerShown: false,
            tabBarItemStyle: { marginTop: 3 },
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="explore"
                color={focused ? "#ffffff" : "#ffdddd"}
                size={27}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? "#ffffff" : "#ffdddd", fontSize: 12, padding: 5 }}>Keşfet</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Ara"
          options={{
            headerShown: false,
            tabBarItemStyle: { marginTop: 3},
            tabBarIcon: ({ focused }) => (
                <MaterialIcons name="tune" color={focused ? "#ffffff" : "#ffdddd"} size={27} />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? "#ffffff" : "#ffdddd", fontSize: 12, padding: 5 }}>Filtre</Text>
            ),
          }}
        >
          {() => <SearchFood updateRecipeRating={updateRecipeRating} />}
        </Tab.Screen>
        <Tab.Screen
          name="Kaydedilenler"
          component={Saveds}
          options={{
            headerShown: false,
            tabBarItemStyle: { marginTop: 3 },
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="bookmark"
                color={focused ? "#ffffff" : "#ffdddd"}
                size={27}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? "#ffffff" : "#ffdddd", fontSize: 12, padding: 5 }}>Kaydedilenler</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Ayarlar"
          component={Settings}
          options={{
            headerShown: false,
            tabBarItemStyle: { marginTop: 3 },
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="settings"
                color={focused ? "#ffffff" : "#ffdddd"}
                size={27}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? "#ffffff" : "#ffdddd", fontSize: 12, padding: 5 }}>Ayarlar</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}