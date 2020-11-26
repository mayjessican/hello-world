// Import dependencies
import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default class Chat extends React.Component {
  render() {
    // Define variables from StartScreen
    let { userName, backgroundColor } = this.props.route.params;

    // Set default username in case the user didn't enter one
    if (!userName || userName === "") userName = "User";

    // Display username on the navbar in place of the title
    this.props.navigation.setOptions({ title: userName });

    return (
      // Set background to the color chosen by the user on StartScreen
      <View
        style={[styles.chatBackground, { backgroundColor: backgroundColor }]}
      >
        {/* Display placeholder text until chat is properly implemented */}
        <Text style={{ color: "#FFFFFF" }}>This chat is your chat screen.</Text>
      </View>
    );
  }
}

// Create styling
const styles = StyleSheet.create({
  chatBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
