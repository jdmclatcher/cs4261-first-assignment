import 'react-native-gesture-handler';
import { Alert, View, Button } from 'react-native';
import Home from './src/Home';
import AddNote from './src/AddNote';
import Login from './src/Login';
import CreateAccount from './src/CreateAccount';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config';

const Stack = createStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function handleUserChange(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleUserChange);
    // unsubscribe on unmount
    return subscriber;
  }, []);

  if (initializing) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{ title: 'Create Account' }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerLeft: () => (
              <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                <Button
                  onPress={() => {
                    Alert.alert(
                      'Log Out',
                      'Are you sure you want to log out?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            signOut(auth).then(() => {
                              navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                              });
                            });
                          },
                        },
                      ],
                    );
                  }}
                  title="Log Out"
                  color="#f00"
                />
              </View>
            ),
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('AddNote')}
                title="New Note"
                color="#000"
              />
            ),
            title: 'Notes',
          })}
        />
        <Stack.Screen
          name="AddNote"
          component={AddNote}
          options={{ title: 'New Note' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
