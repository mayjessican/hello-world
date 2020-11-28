// Import dependencies
import React from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
// Import gifted chat
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  //Test app with static messages
  componentDidMount() {
    const { userName } = this.props.route.params;
    this.setState({
      // Messages must follow the format from gifted chat library
      messages: [
        {
          _id: 1,
          text: `Hello ${userName}`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: this.props.route.params.userName + " has entered the chat.",
          createdAt: new Date(),
          system: true,
        },
      ],
    });
    // Display username on navbar
    this.props.navigation.setOptions({
      title: `Chat room for user: ${userName}`,
    });
  }

  // Function to send a message
  onSend(messages = []) {
    // previousState refers to the component's state at the time the change is applied
    this.setState((previousState) => ({
      // Appends the new messages to messages object or state
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  // Changes the color of the right side of the chat bubble
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
    if (!userName || userName === "") {
      userName = "User";
    }

    return (
      //Render chat layout
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
        {/* If the device OS is Android, adjust height when the keyboard pops up */}
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
  },
});
