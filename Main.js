import * as React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Explore from "./Screens/Explore";
import SearchFood from "./Screens/SearchFood";
import Categories from "./Components/Categories";
import FeaturedRecipes from "./Components/FeaturedRecipes";
import VideoRecipes from "./Components/VideoRecipes";
// import InAppPromotions from './Components/InAppPromotions';
import FoodsOfCountries from './Components/FoodsOfCountries';
import Saveds from './Screens/Saveds';
import { db } from './Config/FirebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
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
      {/* <Stack.Screen name="Tüm Promosyonlar">
        {() => (<InAppPromotions showAll />)}
      </Stack.Screen> */}
    </Stack.Navigator>
  );
};

export default function Main() {
  const { setAllCategoriesData, setAllRecipeData, setAllCountries, setFeaturedRecipes, updateAllRecipeRatings } = useAppContext();

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
        .filter(recipe => recipe.rating !== undefined)
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

  const updateRecipeRating = async (recipeId, newRating, updateSpecificRecipeRating) => {
    try {
      if (!db) throw new Error("Firestore not initialized correctly!");
  
      const recipeDocRef = doc(db, "1", recipeId.toString());
      const recipeDoc = await getDoc(recipeDocRef);
  
      if (!recipeDoc.exists()) {
        throw new Error("Recipe document does not exist!");
      }
  
      const recipeData = recipeDoc.data();
      const currentRatingTotal = recipeData.ratingTotal || 0;
      const currentRatingCount = recipeData.ratingCount || 0;
  
      const updatedRatingTotal = currentRatingTotal + newRating;
      const updatedRatingCount = currentRatingCount + 1;
  
      const newAverageRating = updatedRatingTotal / updatedRatingCount;
  
      await updateDoc(recipeDocRef, {
        ratingTotal: updatedRatingTotal,
        ratingCount: updatedRatingCount,
        rating: newAverageRating
      });
  
      updateSpecificRecipeRating(recipeId, newAverageRating);
  
      return true;
    } catch (error) {
      console.error("Error updating rating:", error);
      return false;
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