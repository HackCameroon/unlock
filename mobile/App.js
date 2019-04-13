import React from "react";
import { Card, StyleSheet, Text, View, Button } from "react-native";
import { MapView } from "expo";
import SocketIOClient from 'socket.io-client';

const connectionConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ['websocket'], // you need to explicitly tell it to use websockets
 };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = SocketIOClient('http://ba782fa2.ngrok.io');
    this.socket.on('connect', () => {
         console.log('connected to server');
    });
    this.callUber = this.callUber.bind(this);
    //this.socket = SocketIOClient('http://localhost:4000');
  }

  callUber() {
    this.socket.emit('call');
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
            style={{ flex: 1 }}
            region={{
              latitude: 40.76727216,
              longitude: -73.99392888,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
        >
        </MapView>
        <View
          style={{
            position: 'absolute',
            top: '80%',
            alignSelf: 'center'
            }}
        >
          <Button
          onPress={this.callUber}
          title="Connect to Uber"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"/>
        </View>
      </View>
    );
  }
}
