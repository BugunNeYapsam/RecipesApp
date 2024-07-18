import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Categories from '../Components/Categories';
import FeaturedRecipes from '../Components/FeaturedRecipes';
import TrendingRecipes from '../Components/TrendingRecipes';
import TopChefs from '../Components/TopChefs';
import VideoRecipes from '../Components/VideoRecipes';
import UserRecommendations from '../Components/UserRecommendations';
import InAppPromotions from '../Components/InAppPromotions';
import FoodsOfCountries from '../Components/FoodsOfCountries';

const Explore = () => {
  // <TrendingRecipes />
  // <TopChefs />
  // <UserRecommendations />
  
  return (
    <ScrollView style={styles.container}>
      <Categories />
      <FeaturedRecipes />
      <VideoRecipes />
      <FoodsOfCountries />
      <InAppPromotions />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
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
});

export default Explore;
