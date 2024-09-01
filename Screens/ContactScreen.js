// ContactScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function ContactScreen() {
  const navigation = useNavigation();

  return (
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Ayarlar')}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İletişim</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>E-mail: </Text>

        <Text style={styles.email}>asfadkng@gmail.com</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    fontSize: 35,
    color: '#000',
    marginRight: 18,
  },

  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  email: {
    fontSize: 18,
    color: '#000',
  },
  title: {
    fontSize: 18,
    color: '#000',
    fontWeight: '700'
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
    marginTop: 6
  },
});
