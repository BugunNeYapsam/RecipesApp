import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../Context/AppContext';

const FoodsOfCountries = ({ showAll }) => {
  const navigation = useNavigation();
  const { allCountries } = useAppContext();

  if (showAll) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.grid}>
          {allCountries?.map((country, index) => (
            <TouchableOpacity key={index} style={styles.countryCard}>
              <Image source={{ uri: country.imageUrl }} style={styles.countryFlag} />
              <View style={styles.countryOverlay}>
                <Text style={styles.countryName}>{country.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Ülkelere Ait Yemekler</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Tüm Ülkeler')}>
          <Text style={styles.seeAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal style={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
        {allCountries?.map((country, index) => (
          <TouchableOpacity key={index} style={styles.countryCard}>
            <Image source={{ uri: country.imageUrl }} style={styles.countryFlag} />
            <View style={styles.countryOverlay}>
              <Text style={styles.countryName}>{country.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
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
  countryCard: {
    width: 120,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B2346',
    shadowColor: '#6B2346',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6
  },
  countryFlag: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  countryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default FoodsOfCountries;