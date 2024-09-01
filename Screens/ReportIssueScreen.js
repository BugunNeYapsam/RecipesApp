import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

export default function ReportIssueScreen() {
  const [issueDescription, setIssueDescription] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://your-backend-url/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueDescription,
        }),
      });

      if (response.ok) {
        Alert.alert('Başarılı', 'Sorununuz başarıyla iletildi.');
        navigation.navigate('Ayarlar');
      } else {
        Alert.alert('Hata', 'Rapor gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Ekran odaklandığında yapılacak işlemler
      return () => {
        // Ekran odaklanmayı bıraktığında yapılacak işlemler
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Ayarlar')}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hata Bildir</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Sorun Açıklaması:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Sorununuzu buraya yazın"
          multiline
          numberOfLines={6}
          value={issueDescription}
          onChangeText={setIssueDescription}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Gönder</Text>
        </TouchableOpacity>
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

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 6
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  textArea: {
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
