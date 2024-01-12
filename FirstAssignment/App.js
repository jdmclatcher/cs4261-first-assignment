import "react-native-gesture-handler";
import { StyleSheet, Text, View, Button } from "react-native";
import Home from "./src/Home";
import AddNote from "./src/AddNote";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("AddNote")}
                title="New Note"
                color="#000"
              />
            ),
            title: "Notes",
          })}
        />
        <Stack.Screen
          name="AddNote"
          component={AddNote}
          options={{ title: "New Note" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
