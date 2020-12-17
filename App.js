/* eslint-disable react/jsx-filename-extension */
/* eslint-disable linebreak-style */

// Import dependencies
import React, { Component } from 'react';
// Import React Native Gesture Handler
import 'react-native-gesture-handler';
// Import React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Import the screens we want to navigate
import Chat from './components/Chat';
import Start from './components/Start';

// Create Navigator
const Stack = createStackNavigator();

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {
  // renderCustomActions = (props) => <CustomActions {...props} />;

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          // First screen to load upon launching the app
          initialRouteName="Start"
        >
          <Stack.Screen name="Home" component={Start} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
