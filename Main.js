import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Explore from "./Screens/Explore";
import AllRecipes from "./Screens/AllRecipes";
import SearchScreen from './Screens/SearchScreen';
import Categories from "./Components/Categories";
import FeaturedRecipes from "./Components/FeaturedRecipes";
import VideoRecipes from './Components/VideoRecipes';
import InAppPromotions from './Components/InAppPromotions';
import FoodsOfCountries from './Components/FoodsOfCountries';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from './Config/FirebaseConfig';
import { useAppContext } from './Context/AppContext';

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

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        if (route.name === "Ara") {
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.middleButton}
            >
              <View style={styles.middleButtonContainer}>
                <MaterialIcons name="search" color="#fff" size={32} />
              </View>
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <MaterialIcons
                name={route.name === "Keşfet" ? "explore" : "list"}
                color={isFocused ? '#6B2346' : '#666'}
                size={24}
              />
              <Text style={{ color: isFocused ? '#6B2346' : '#666', fontSize: 12 }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        }
      })}
    </View>
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
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen name="Keşfet" options={{ headerShown: false }} component={ExploreStack} />
        <Tab.Screen name="Ara" options={{ headerShown: false }} component={SearchScreen} />
        <Tab.Screen name="Yemek Öner" options={{ headerShown: false }} component={AllRecipes} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    borderRadius: 15,
    elevation: 2,
  },
  middleButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  middleButtonContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6B2346',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});