import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import {
  Swipeable,
  RectButton,
  ScrollView,
} from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  doc,
  deleteDoc,
  onSnapshot,
  collection,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { firebase, auth } from '../config';

const Home = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      // Check if the user is online
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        // If the user is offline, load the notes from AsyncStorage
        const storedNotes = await AsyncStorage.getItem('notes');
        setNotes(storedNotes ? JSON.parse(storedNotes) : []);
        return;
      }

      // If the user is online, fetch the notes from Firestore
      const notesQuery = query(
        collection(firebase, 'notes'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc'),
      );

      const unsubscribe = onSnapshot(notesQuery, snapshot => {
        const newNotes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Store the notes in AsyncStorage
        AsyncStorage.setItem('notes', JSON.stringify(newNotes));

        setNotes(newNotes);
      });

      return () => unsubscribe();
    };

    loadNotes();
  }, []);

  // enable swiping left to ask user if they want to delete the note
  const renderLeftActions = note => {
    return (
      <RectButton
        style={{ width: 100, backgroundColor: 'red' }}
        onPress={() => {
          Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: async () => {
                  const noteRef = doc(firebase, 'notes', note.id);
                  await deleteDoc(noteRef);
                },
              },
            ],
          );
        }}>
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text style={{ color: 'white' }}>Delete</Text>
        </View>
      </RectButton>
    );
  };

  return (
    // return notes as cards if there's any, otherwise return a helpful message
    <View style={{ flex: 1 }}>
      {notes.length > 0 ? (
        <ScrollView style={{ flex: 1 }}>
          {notes.map(note => (
            <Swipeable
              key={note.id}
              friction={4} // make it harder to swipe
              renderLeftActions={() => renderLeftActions(note)}
              renderRightActions={() => renderLeftActions(note)}>
              <Card containerStyle={{ borderRadius: 10 }}>
                <Card.Title style={{ fontSize:18, fontWeight: 'bold' }}>{note.title}</Card.Title>
                <Card.Divider />
                <Text style={{ fontSize: 14, margin: 10 }}>
                  {note.description}
                </Text>
              </Card>
            </Swipeable>
          ))}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'gray', fontStyle: 'italic' }}>
              Click on "New Note" to create a new note!
            </Text>
          </View>
          <View style={{ flex: 2 }} />
        </View>
      )}
    </View>
  );
};

export default Home;
