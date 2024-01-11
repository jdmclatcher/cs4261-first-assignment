import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { onSnapshot, collection } from "firebase/firestore";
import { firebase } from "../config";

const Home = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firebase, "notes"),
      (snapshot) => {
        const newNotes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotes(newNotes);
      }
    );

    // Unsubscribe from snapshots when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View>
      {notes.map((note) => (
        <View key={note.id}>
          <Text>{note.title}</Text>
          <Text>{note.description}</Text>
        </View>
      ))}
    </View>
  );
};

export default Home;
