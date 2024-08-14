import * as React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Explore from "./Screens/Explore";
import AllRecipes from "./Screens/AllRecipes";
import SearchScreen from './Screens/SearchScreen';
import Categories from "./Components/Categories";
import FeaturedRecipes from "./Components/FeaturedRecipes";
import VideoRecipes from "./Components/VideoRecipes";
import InAppPromotions from './Components/InAppPromotions';
import FoodsOfCountries from './Components/FoodsOfCountries';
import { collection, getDocs } from "firebase/firestore";
import { db } from './Config/FirebaseConfig';
import { useAppContext } from './Context/AppContext';
import { getPathDown } from './Components/CurvedBar';
import { Svg, Path } from "react-native-svg";
import { scale } from "react-native-size-scaling";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ExploreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Anasayfa" component={Explore} />
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
  const [maxWidth, setMaxWidth] = React.useState(Dimensions.get("window").width);
  const returnpathDown = getPathDown(maxWidth, 60, 50);

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
      <Tab.Navigator screenOptions={{ 
        tabBarStyle: { backgroundColor: "transparent", borderTopWidth: 0, position: "absolute", elevation: 0 }, 
      }}>
         <Tab.Screen
            name="Keşfet"
            component={ExploreStack}
            options={{
              headerShown: false,
              tabBarItemStyle: { marginTop: -3 },
              tabBarIcon: ({ focused }) => (
                <MaterialIcons 
                  name="explore" 
                  color={focused ? "#6B2346" : "#4A4A4A"} 
                  size={28} 
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? "#6B2346" : "#000000", fontSize: 10, padding: 5 }}>Keşfet</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Ara"
            component={SearchScreen}
            options={{
              headerShown: false,
              unmountOnBlur: false,
              tabBarItemStyle: { margin: 0, zIndex: -50 },
              tabBarIcon: ({ focused }) => (
                <View style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  height: 50, 
                  width: 50, 
                  backgroundColor: focused ? "#6B2346" : "white", 
                  borderRadius: 25 
                }}>
                  <MaterialIcons name="search" color={focused ? "#ffffff" : "#4A4A4A"} size={32} />
                </View>
              ),
              tabBarLabel: () => (
                <View>
                  <Svg width={maxWidth} height={scale(60)}>
                    <Path fill={"white"} {...{ d: returnpathDown }} />
                  </Svg>
                </View>
              ),
            }}
          />
      <Tab.Screen
        name="Yemek Öner"
        component={AllRecipes}
        options={{ 
          headerShown: false,
          tabBarItemStyle: { marginTop: -3 },
          tabBarIcon: ({ focused }) => (
            <MaterialIcons 
              name="restaurant-menu" 
              color={focused ? "#6B2346" : "#4A4A4A"} 
              size={28} 
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "#6B2346" : "#000000", fontSize: 10, padding: 5 }}>Yemek Öner</Text>
          ),
        }}
      />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
