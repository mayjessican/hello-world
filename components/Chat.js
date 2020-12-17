/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-use-before-define */

// Import dependencies
import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, KeyboardAvoidingView,
} from 'react-native';

// Import gifted chat
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

// Import Firebase/Firestore
const firebase = require('firebase');
require('firebase/firestore');

/**
 * @class Chat
 * @requires React
 * @requires React-native
 * @requires react-native-gifted-chat
 * @requires react-native-gifted-chat/netinfo
 * @requires CustomActions from './CustomActions'
 * @requires firebase
 * @requires firestore
 */

export default class Chat extends Component {
  constructor() {
    super();
    /**
     * Firestore credentials
     * @param {string} apiKey
     * @param {string} authDomain
     * @param {string} databaseURL
     * @param {string} projectId
     * @param {string} storageBucket
     * @param {string} messageSenderId
     * @param {string} appId
     * @param {string} measurementId
     */
    // Connect to firestore
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyBt36uHTTEH1-fKp9rK-u4pXkcHApwqmgA',
        authDomain: 'fir-test-41ea8.firebaseapp.com',
        databaseURL: 'https://fir-test-41ea8.firebaseio.com',
        projectId: 'fir-test-41ea8',
        storageBucket: 'fir-test-41ea8.appspot.com',
        messagingSenderId: '765285691035',
        appId: '1:765285691035:web:1100563b6396b55133a03e',
        measurementId: 'G-YQ7DK09RL2',
      });
    }
    // Reference messages collection from firestore
    this.referenceMessages = firebase.firestore().collection('messages');
    // Initialises state for user
    this.state = {
      systemMessages: [],
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      uid: 0,
      isConnected: false,
    };
  }

  /**
   * @function componentDidMount
   * NetInfo checks whether user is online
   * Then sets state accordingly
   * Uses Firebase anonymous authentication
   * Subscribes authenticated user to Firestore collection
   * Retrieves user's messages from Firestore
   */
  componentDidMount() {
    const { userName } = this.props.route.params;
    // Use NetInfo to check is user is on or offline
    NetInfo.fetch().then((state = {}) => {
      if (state.isConnected) {
        // Authorisation using Firebase
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              try {
                await firebase.auth().signInAnonymously();
              } catch (error) {
                console.log(`Unable to sign in: ${error.message}`);
              }
            }
            this.setState({
              isConnected: true,
              user: {
                _id: user.uid,
                name: this.props.route.params.userName,
              },
              systemMessages: [
                {
                  _id: 1,
                  text: `Hello ${userName}`,
                  createdAt: new Date(),
                  user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                  },
                },
                {
                  _id: 2,
                  text: `${this.props.route.params.userName} has entered the chat`,
                  createdAt: new Date(),
                  system: true,
                },
              ],
            });

            // Listen for collection changes for current user
            this.unsubscribe = this.referenceMessages.onSnapshot(
              this.onCollectionUpdate,
            );
          });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
    // Display username on navbar
    this.props.navigation.setOptions({
      title: `Chat room for user: ${userName}`,
    });
  }

  /**
  * @function componentWillUnmount
  * Stops listening to authentication and collection changes
  */
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  /**
  * @function onSend - function to send a message
  * @param {*} messages - type: {message/image/location}
  * @returns {state} - updates state with new message
  */
  onSend(messages = []) {
    // previousState refers to the component's state at the time the change is applied
    this.setState(
      (previousState) => ({
        // Appends the new messages to messages object or state
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      },
    );
  }

  /**
  * Gets messages from async storage
  * Parses messages
  * @function getMessages
  * @return messages
  */
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
  * Saves messages to asyncStorage
  * Stringifies messages
  * @function saveMessages
  * @async
  * @return {Promise<string>} - Messages from asyncStorage
  */
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages),
      );
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Deletes messages from asyncStorage
   * @function deleteMessages
   * @async
  */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
  * Updates state with new message
  * @function onCollectionUpdate
  * @param {string} _id
  * @param {string} text
  * @param {string} image - uri of image
  * @param {number} location - coordinates
  * @param {string} user
  * @param {date} createdAt
  */
  onCollectionUpdate = (querySnapshot = []) => {
    // when messages from firebase come, they override message we set from the beginning
    const messagesFromFirebase = [];
    // Go through each document
    querySnapshot.forEach((doc = {}) => {
      // Get the QueryDocumentSnapshot's data
      const data = doc.data();
      if (data._id) {
        // Make sure to push only message with valid _id
        messagesFromFirebase.push({
          _id: data._id,
          text: data.text.toString(),
          // use toDate() to convert firebase time format to JS date for consistency
          createdAt: data.createdAt.toDate(),
          user: data.user,
          image: data.image || '',
          location: data.location || '',
        });
      }
    });

    // Combine system message with messages from firebase (otherwise firebase will overide)
    // eslint-disable-next-line react/no-access-state-in-setstate
    const messages = [...this.state.systemMessages, ...messagesFromFirebase];

    // Sorts by descending date to make sure messages are in order
    this.setState(
      {
        messages: messages.sort((a, b) => b.createdAt - a.createdAt),
      },
      () => {
        this.saveMessages();
      },
    );
  };

  /**
   * Adds the message object to the collection
   * @function addMessage
   * @param {number} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {string} user
   * @param {image} image
   * @param {number} geo - coordinates
   */
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      uid: this.state.uid,
      image: message.image || '',
      location: message.location || '',
    });
  };

  /**
  * Changes bubble color of chat messages
  * @function renderBubble
  * @param {*} props
  * @returns {Bubble}
  */
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: 'white',
          },
        }}
      />
    );
  }

  /**
  * Rendering the '+' button
  * @function renderCustomActions
  * @param {*} props
  * @returns {CustomActions}
  */
  renderCustomActions = (props) => <CustomActions {...props} />;

  /**
  * Renders MapView if message has coords
  * @function renderCustomView
  * @param {*} props
  * @returns {MapView}
  */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    // Define variables from StartScreen
    let { userName, backgroundColor } = this.props.route.params;

    // Set default username in case the user didn't enter one
    if (!userName || userName === '') {
      userName = 'User';
    }

    return (
      // Render chat layout
      <View style={[styles.chatBackground, { backgroundColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          renderInputToolbar={(props) => {
            if (this.state.isConnected === false) {
              return null;
            }
            return <InputToolbar {...props} />;
          }}
        />
        {/* If the device OS is Android, adjust height when the keyboard pops up */}
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

/**
 * Create styling
 */
const styles = StyleSheet.create({
  chatBackground: {
    flex: 1,
  },
  userName: {
    fontSize: 10,
    color: '#fff',
    alignSelf: 'center',
    opacity: 0.5,
    marginTop: 25,
  },
});
