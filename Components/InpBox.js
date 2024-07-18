import React from 'react';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';

export default function InputBox() {
    const [text, onChangeText] = React.useState('');

    return (
        <SafeAreaView>
        <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder="Malzemeyi girin..."
            keyboardType="string"
        />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 15,
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
    },
  });