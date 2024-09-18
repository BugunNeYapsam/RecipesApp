import React from 'react';
import { ScrollView, StyleSheet, Platform, StatusBar, SafeAreaView, View, Image } from 'react-native';
import Categories from '../Components/Categories';
import FeaturedRecipes from '../Components/FeaturedRecipes';
import VideoRecipes from '../Components/VideoRecipes';
// import InAppPromotions from '../Components/InAppPromotions';
import FoodsOfCountries from '../Components/FoodsOfCountries';
import headerImage from '../assets/headerBNY.png';

const Explore = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={{ marginTop: 5, marginBottom: -5, paddingBottom: 10 }}>
          <Image source={headerImage} style={styles.headerImage} />
        </View>
        <ScrollView style={styles.container}>
          <Categories />
          <FeaturedRecipes />
          <VideoRecipes />
          <FoodsOfCountries />
          {/* <InAppPromotions /> */}
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: 300,
    height: 50,
    marginLeft: 1
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
    backgroundColor: '#ffffff',
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
});

export default Explore;
