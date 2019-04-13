import React from "react";
import {StyleSheet, Text, View, Button, Dimensions} from "react-native";
import SocketIOClient from 'socket.io-client';
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';

const connectionConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ['websocket'], // you need to explicitly tell it to use websockets
 };

 const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = SocketIOClient('http://ba782fa2.ngrok.io');
    this.socket.on('connect', () => {
         console.log('connected to server');
    });

    this.socket.on('uber', (data) => {
      console.log(data);
      this.getDirections(`${data.startLat}, ${data.startLng}`, `${data.endLat}, ${data.endLng}`);
    });

    this.getDirections = this.getDirections.bind(this);
    this.callUber = this.callUber.bind(this);
    this.unlockCar = this.unlockCar.bind(this);

    this.state = {
      coords: []
    };
  }

  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyBFb-ijeIhz4nmGHusKruKaizPOYDsVipU`)
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.routes[0].overview_polyline.points);

        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })

        this.setState({coords: coords})
        return coords
    } catch(error) {
        alert(error);
        return error
    }
  }

  unlockCar() {
    this.socket.emit('unlock');
  }

  callUber() {
    this.socket.emit('call');
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView style={styles.map} initialRegion={{
          latitude:34.0522,
          longitude:-118.2437,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}>

        <MapView.Polyline
          coordinates={this.state.coords}
          strokeWidth={2}
          strokeColor="red"/>

        </MapView>
        <View
          style={{
            position: 'absolute',
            top: '20%',
            alignSelf: 'center'
            }}
        >
          <Button
          onPress={this.unlockCar}
          title="Unlock Car"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"/>
        </View>
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
