import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#bbd0c4', '#a1d0c4', '#bbd0c4']} style={styles.gradient}>
        <View style={styles.container}>
          <Text>ARAMA EKRANI</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});