import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import { Card } from "react-native-elements";
import {
  doc,
  deleteDoc,
  onSnapshot,
  collection,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firebase, auth } from "../config";

const Home = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // sort notes by the time they were created
    const notesQuery = query(
      collection(firebase, "notes"),
      where("userId", "==", auth.currentUser.uid), // only get notes for the current user
      orderBy("createdAt", "desc")
    );
    // map notes
    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const newNotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(newNotes);
    });

    // Unsubscribe from snapshots when component unmounts
    return () => unsubscribe();
  }, []);

  // enable swiping left to ask user if they want to delete the note
  const renderLeftActions = (note) => {
    return (
      <RectButton
        style={{ width: 100, backgroundColor: "red" }}
        onPress={() => {
          Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: async () => {
                  const noteRef = doc(firebase, "notes", note.id);
                  await deleteDoc(noteRef);
                },
              },
            ]
          );
        }}
      >
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </View>
      </RectButton>
    );
  };

  return (
    // return notes as cards if there's any, otherwise return a helpful message
    <View style={{ flex: 1 }}>
      {notes.length > 0 ? (
        notes.map((note) => (
          <Swipeable
            key={note.id}
            friction={2} // make it harder to swipe
            renderLeftActions={() => renderLeftActions(note)}
            renderRightActions={() => renderLeftActions(note)}
          >
            <Card>
              <Card.Title>{note.title}</Card.Title>
              <Card.Divider />
              <Text style={{ fontSize: 14, margin: 10 }}>
                {note.description}
              </Text>
            </Card>
          </Swipeable>
        ))
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "gray", fontStyle: "italic" }}>
              Click on "New Note" to create a new note!
            </Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      )}
    </View>
  );
};

export default Home;
