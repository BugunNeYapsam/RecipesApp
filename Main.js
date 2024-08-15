import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Explore from "./Screens/Explore";
import AllRecipes from "./Screens/AllRecipes";
import Categories from "./Components/Categories";
import FeaturedRecipes from "./Components/FeaturedRecipes";
import TrendingRecipes from "./Components/TrendingRecipes";
import TopChefs from './Components/TopChefs';
import VideoRecipes from './Components/VideoRecipes';
import UserRecommendations from './Components/UserRecommendations';
import InAppPromotions from './Components/InAppPromotions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FoodsOfCountries from './Components/FoodsOfCountries';
import Filter from './Screens/Filter'; 
import { collection, getDocs } from "firebase/firestore"; 
import { db } from './Config/FirebaseConfig';
import { useAppContext } from './Context/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ExploreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Bugün Ne Yapsam?" component={Explore} />
      <Stack.Screen name="Tüm Kategoriler">
        {() => (<Categories showAll />)}
      </Stack.Screen>
      <Stack.Screen name="Tüm Öne Çıkan Tarifler">
        {() => (<FeaturedRecipes showAll />)}
      </Stack.Screen>
      <Stack.Screen name="Tüm Trend Tarifler">
        {() => (<TrendingRecipes showAll />)}
      </Stack.Screen>
      <Stack.Screen name="Tüm En İyi Şefler">
        {() => (<TopChefs showAll />)}
      </Stack.Screen>
      <Stack.Screen name="Tüm Video Tarifler">
        {() => (<VideoRecipes showAll />)}
      </Stack.Screen>
      <Stack.Screen name="Tüm Kullanıcı Önerileri">
        {() => (<UserRecommendations showAll />)}
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

  React.useEffect(() => {
    getData();
    getCategories();
    getCountries();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          tabBarActiveTintColor: '#6B2346', // Active tab text color
          tabBarInactiveTintColor: '#666', // Inactive tab text color
          tabBarStyle: {
            borderTopWidth: 1, // Top border width
            borderTopColor: '#ccc', // Top border color
          },
        }}>
        <Tab.Screen 
          name="Keşfet"
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="explore" color={color} size={25} />
            ),
          }}>
            {() => <ExploreStack />}
        </Tab.Screen>
        <Tab.Screen
          name="Filtre"
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="tune" color={color} size={25} /> // Yeni ikon
            ),
          }}>
            {() => <Filter />}
        </Tab.Screen>
        <Tab.Screen
          name="Tüm Yemekler"
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="list" color={color} size={25} />
            ),
          }}>
            {() => <AllRecipes />}
        </Tab.Screen>
        
      </Tab.Navigator>
    </NavigationContainer>
  );    
}
