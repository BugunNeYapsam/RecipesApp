import React from 'react';
import {Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';

export default function InputBox() {
    const [text, onChangeText] = React.useState('');


    return (
        <SafeAreaView> 
            <TouchableOpacity style={styles.touchable}>
                <Text style={styles.textStyle}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    touchable: {
      height: 40,
      margin: 15,
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      backgroundColor: '#971245',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
    }
  });