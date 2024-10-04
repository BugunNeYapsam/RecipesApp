import React from 'react';
import { ScrollView, StyleSheet, Platform, StatusBar, SafeAreaView, View, Image, RefreshControl, Text, Button } from 'react-native';
import Categories from '../Components/Categories';
import FeaturedRecipes from '../Components/FeaturedRecipes';
import FoodsOfCountries from '../Components/FoodsOfCountries';
import headerImage from '../assets/headerBNY.png';
import headerImageLight from '../assets/headerBNY_light.png';
import { useAppContext } from '../Context/AppContext';

const Explore = (props) => {
  const { isDarkMode } = useAppContext();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([props.retrieveAllData()])
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, []);

  const dynamicLineStyle = {
    backgroundColor: isDarkMode ? '#AAAAAA' : '#2F2F2F'
  };

  const dynamicDotStyle = {
    color: isDarkMode ? '#AAAAAA' : '#2F2F2F'
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.separatorContainer}>
          <Image source={isDarkMode ? headerImage : headerImageLight} style={styles.headerImage} />
        </View>
        <View style={styles.separatorContainer}>
          <View style={[styles.line, dynamicLineStyle]} />
          <Text style={[styles.dot, dynamicDotStyle]}>•</Text>
          <View style={[styles.line, dynamicLineStyle]} />
        </View>
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ScrollView style={styles.container}>
          <Categories />
          <FeaturedRecipes />
          <FoodsOfCountries />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: 300,
    height: 50,
    marginLeft: 1,
    marginTop: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: 'blue',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  categoryCard: {
    width: 120,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: "20%"
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5
  },
  line: {
    height: 0.5,
    width: 150,
  },
  dot: {
    marginHorizontal: 10,
    fontSize: 10,
  },
});

export default Explore;