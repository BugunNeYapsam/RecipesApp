import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';

const initialTags = ['Etiket1', 'Etiket2', 'Etiket3', 'Etiket4'];

const Filter = () => {
  const [text, setText] = useState('');
  const [tags, setTags] = useState(initialTags);

  const handleTextChange = (value) => {
    const lastChar = value.slice(-1);
    
    if (lastChar === ',') {
      const newTag = value.slice(0, -1).trim();
      if (newTag.length > 0 && !tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      }
      setText('');
    } else {
      setText(value);
    }
  };

  const handleAddTag = (tag) => {
    setText((prevText) => prevText + tag + ', ');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <FlatList
            data={tags}
            renderItem={({ item }) => (
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(item)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item}
            style={styles.tagList}
            horizontal
          />
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={handleTextChange}
            placeholder="Etiket ekleyin..."
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'column',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    marginTop: 8,
  },
  tagList: {
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 8,
    marginRight: 8,
  },
  tagText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  
  removeButtonText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.2)',
  },
});

export default Filter;
