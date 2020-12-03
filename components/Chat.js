// Import dependencies
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  KeyboardAvoidingView,
} from "react-native";
// Import gifted chat
import { GiftedChat, Bubble } from "react-native-gifted-chat";

// Import Firebase/Firestore
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    // Connect to firestore
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBt36uHTTEH1-fKp9rK-u4pXkcHApwqmgA",
        authDomain: "fir-test-41ea8.firebaseapp.com",
        databaseURL: "https://fir-test-41ea8.firebaseio.com",
        projectId: "fir-test-41ea8",
        storageBucket: "fir-test-41ea8.appspot.com",
        messagingSenderId: "765285691035",
        appId: "1:765285691035:web:1100563b6396b55133a03e",
        measurementId: "G-YQ7DK09RL2",
      });
    }
    // Reference messages collection from firestore
    this.referenceMessages = firebase.firestore().collection("messages");
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      uid: 0,
    };
  }

  componentDidMount() {
    const { userName } = this.props.route.params;
    // Authorisation using Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
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
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: "Hello There",
      });
      // create a reference to the active user's documents (messages)
      this.referenceMessageUser = firebase.firestore().collection("messages");
      // listen for collection changes for current user
      this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(
        this.onCollectionUpdate
      );
    });
    this.setState({
      // Messages must follow the format from gifted chat library
      messages: [],
    });
  }

  // Stop listening to auth and collection changes
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  // Function to send a message
  onSend(messages = []) {
    // previousState refers to the component's state at the time the change is applied
    this.setState((previousState) => ({
      // Appends the new messages to messages object or state
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  // Updates messages in state
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt,
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };

  //Pushes messages to Firestore database
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      uid: this.state.uid,
      sent: true,
    });
  };

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

    // Display username on navbar
    this.props.navigation.setOptions({
      title: `Chat room for user: ${userName}`,
    });

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
