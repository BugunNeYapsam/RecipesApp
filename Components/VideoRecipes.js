import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const videoRecipes = [
  { name: 'How to Make Spaghetti Carbonara', image: "" },
  { name: 'Easy Chicken Alfredo', image: "" },
  { name: 'Best Beef Stroganoff', image: "" },
  // Add more video recipes if needed
];

const VideoRecipes = ({ showAll }) => {
  const navigation = useNavigation();

  if (showAll) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.grid}>
          {videoRecipes?.map((recipe, index) => (
            <TouchableOpacity key={index} style={styles.videoCard}>
              <Image source={recipe.image} style={styles.videoImage} />
              <View style={styles.playIconOverlay}>
                <MaterialIcons name="play-circle-outline" size={50} color="#fff" />
              </View>
              <Text style={styles.videoName}>{recipe.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Video Tarifler</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Tüm Video Tarifler')}>
          <Text style={styles.seeAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal style={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
        {videoRecipes?.map((recipe, index) => (
          <TouchableOpacity key={index} style={styles.videoCard}>
            <Image source={recipe.image} style={styles.videoImage} />
            <View style={styles.playIconOverlay}>
              <MaterialIcons name="play-circle-outline" size={50} color="#fff" />
            </View>
            <View style={styles.videoOverlay}>
              <Text style={styles.videoName}>{recipe.name}</Text>
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
  videoCard: {
    width: 200,
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
    borderWidth: 1,
    borderColor: '#6B2346',
    shadowColor: '#6B2346',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  videoName: {
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

export default VideoRecipes;