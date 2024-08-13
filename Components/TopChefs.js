import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const topChefs = [
  { name: 'Chef Gordon Ramsay', image: 'https://picsum.photos/200' },
  { name: 'Chef Jamie Oliver', image: 'https://picsum.photos/200' },
  { name: 'Chef Nigella Lawson', image: 'https://picsum.photos/200' },
  // Add more top chefs if needed
];

const TopChefs = ({ showAll }) => {
  const navigation = useNavigation();

  if (showAll) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.grid}>
          {topChefs?.map((chef, index) => (
            <TouchableOpacity key={index} style={styles.chefCard}>
              <Image source={chef.image} style={styles.chefImage} />
              <Text style={styles.chefName}>{chef.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>En İyi Şefler</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Tüm En İyi Şefler')}>
          <Text style={styles.seeAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal style={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
        {topChefs?.map((chef, index) => (
          <TouchableOpacity key={index} style={styles.chefCard}>
            <Image source={chef.image} style={styles.chefImage} />
            <View style={styles.chefOverlay}>
              <Text style={styles.chefName}>{chef.name}</Text>
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
    marginBottom: 10,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: 'blue',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  chefCard: {
    width: 120,
    height: 180,
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
    borderWidth: 1,
    borderColor: '#6B2346',
    shadowColor: '#6B2346',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6
  },
  chefImage: {
    width: '100%',
    height: '75%',
    resizeMode: 'cover',
  },
  chefOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  chefName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default TopChefs;