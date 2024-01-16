import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
} from 'react-native';
import { firebase, auth } from '../config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddNote = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false); // prevent spam clicking save note

  // Save the note here, then navigate back to the home screen
  const handleSave = async () => {
    setIsLoading(true);
    // Create a new note
    const note = {
      title,
      description,
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid,
    };

    // Get a reference to the Firestore collection
    const notesCollection = collection(firebase, 'notes');

    // Add the new note
    try {
      await addDoc(notesCollection, note);
      // Navigate back to the home screen
      navigation.goBack();
    } catch (error) {
      console.error('Error adding note: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.descriptionInput}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button
        title="Save Note"
        onPress={handleSave}
        // Disable the button if the title is empty or if we're saving the note
        disabled={title === '' || isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    height: Platform.OS === 'android' ? 40 : 25,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    height: 150,
    textAlignVertical: 'top',
  },
});

export default AddNote;
