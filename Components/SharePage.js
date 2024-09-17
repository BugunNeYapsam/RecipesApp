import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Share,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function SharePage() {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Bu harika uygulamayı denemelisiniz!',
        url: 'https://www.example.com', // Uygulama linkini buraya ekleyin
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paylaş</Text>
      <TouchableOpacity onPress={handleShare} style={styles.button}>
        <FeatherIcon name="share" size={24} color="#fff" />
        <Text style={styles.buttonText}>Paylaş</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
