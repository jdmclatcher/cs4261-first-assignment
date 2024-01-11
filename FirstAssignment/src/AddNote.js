import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { firebase } from "../config";
import { collection, addDoc } from "firebase/firestore";

const AddNote = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    // Save the note here, then navigate back to the home screen
    // Create a new note
    const note = { title, description };

    // Get a reference to the Firestore collection
    const notesCollection = collection(firebase, "notes");

    // Add the new note
    try {
      await addDoc(notesCollection, note);
      console.log("Note added!");
      // Navigate back to the home screen
      navigation.goBack();
    } catch (error) {
      console.error("Error adding note: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Save Note" onPress={handleSave} />
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
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default AddNote;
