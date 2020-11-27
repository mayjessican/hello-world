// Import dependencies
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
// Import gifted chat
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: "This is a system message",
          createdAt: new Date(),
          system: true,
        },
        {
          _id: 3,
          text: this.props.navigation.state.params.userName + ' has joined the chat.',
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
        }}
      />
    );
  }

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
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* Display placeholder text until chat is properly implemented */}
        <Text style={{ color: "#FFFFFF" }}>This chat is your chat screen.</Text>
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
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
