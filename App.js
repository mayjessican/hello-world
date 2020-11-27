// Import dependencies
import React, { Component } from "react";
// Import the screens we want to navigate
import Chat from "./components/Chat";
// Import React Native Gesture Handler
import "react-native-gesture-handler";
// Import React Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Start from "./components/Start";

// Create the navigator
const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          //First screen to load upon launching the app
          initialRouteName="Start"
        >
          <Stack.Screen name="Home" component={Start} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
