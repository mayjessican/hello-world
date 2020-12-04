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

export default class Chat extends Component {
  constructor() {
    super();
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
    // Initialises state for user
    this.state = {
      systemMessages: [],
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
        user: {
          _id: user.uid,
          name: this.props.route.params.userName,
          loggedInText: "Hello there",
        },
      });

      // Listen for collection changes for current user
      this.unsubscribe = this.referenceMessages.onSnapshot(
        this.onCollectionUpdate
      );
    });
    this.setState({
      // Messages must follow the format from gifted chat library
      systemMessages: [
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

  // Stop listening to auth and collection changes
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  // Function to send a message
  onSend(messages = []) {
    // previousState refers to the component's state at the time the change is applied
    this.setState(
      (previousState) => ({
        // Appends the new messages to messages object or state
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  // Updates messages in state
  onCollectionUpdate = (querySnapshot) => {
    // when messages from firebase come, they override message we set from the beginning
    const messagesFromFirebase = [];
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get the QueryDocumentSnapshot's data
      const data = doc.data();
      if (data._id) { // Make sure to push only message with valid _id
        messagesFromFirebase.push({
          _id: data._id,
          text: data.text.toString(),
          createdAt: data.createdAt.toDate(), // use toDate() to convert firebase time format to Javascript Date for consistency
          user: data.user,
        });
      }
    });

    // We need to combine the system message we set with messages from firebase
    // this hack always adds these welcome messages to the actual (firebase) messages
    // if not, firebase messages will override welcome messages
    const messages = [
      ...this.state.systemMessages,
      ...messagesFromFirebase,
    ];

    this.setState({
      messages: messages.sort((a, b) => b.createdAt - a.createdAt), // Sort by date descending, to make sure messages are in order
    });
  };

  //Pushes messages to Firestore database
  addMessage = () => {
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

  // Do you understand everything? Yes I think so, I want to look it over again but you were very clear and I followed everything. Nice, still the button doesn't work well here

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
          user={
            // _id: 1,
            //this.user,
            this.state.user
          }
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
  //   userName: {
  //   fontSize: 10,
  //   color: "#fff",
  //   alignSelf: "center",
  //   opacity: 0.5,
  //   marginTop: 25
  // }
});
