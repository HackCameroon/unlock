import React from "react";
import {Alert, StyleSheet, View, Dimensions, YellowBox} from "react-native";
import { Text, Button } from 'react-native-elements';
import SocketIOClient from 'socket.io-client';
import MapView, {Marker} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Icon from "react-native-vector-icons/Ionicons";
import {About} from './components/About.js';

const marker = require('./assets/marker.png')

let lat;
let long;

console.disableYellowBox = true;

const connectionConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ['websocket'], // you need to explicitly tell it to use websockets
 };

 const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]

 const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 100
  },
  container: {
   flex: 1
  },
  button: {
     backgroundColor: 'navy',
     borderWidth: 0,
     shadowOffset:{  width: 0,  height: 2,  },
     shadowColor: 'black',
     shadowOpacity: 0.5,
     shadowRadius: 3
  }
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = SocketIOClient('http://d2ed6f84.ngrok.io');
    this.socket.on('connect', () => {
         console.log('connected to server');
    });

    this.socket.on('uber', (data) => {
      this.setState({
        minimum: this.state.minimum,
        marker: this.state.marker,
        coords: this.state.coords,
        slideState : this.state.slideState,
        slideState2 : this.state.slideState2,
        info: {
          image: data.image,
          name: data.name,
          phone: data.phone,
          model: data.model,
          license: data.license
        }
      })
      this.getDirections(`${data.startLat}, ${data.startLng}`, `${data.endLat}, ${data.endLng}`);
    });

    this.socket.on('notriding', () => {
      Alert.alert(
        "You don't seem to be in a ride!",
        "Go call an Uber!",
        [
          { text: 'Okay',
            onPress: () => {
            },
            style: 'cancel'
          }
        ]
      );
    });

    this.socket.on('notregistered', () => {
      Alert.alert(
        "This driver isn't registered with our system",
        "Be careful!",
        [
          { text: 'Okay',
            onPress: () => {
            },
            style: 'cancel'
          }
        ],
      );
    });

    this.socket.on('update', (data) => {
      console.log(data);
      let coordinates = data.coords;
      let min = data.minimum;
      if(min >= 1600 && !this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          'The Uber Driver is off course',
          'Are you okay?',
          [
            { text: 'Get me out of here!',
              onPress: () => {
                this.unlockCar();
                this.alertPresent = false;
              }
            },
            {
              text: "I'm okay.",
              onPress: () => {
                this.alertPresent = false;
              },
              style: 'cancel'
            }
          ],
          {cancelable: false},
        );
      }
      lat = coordinates.latitude;
      longitude = coordinates.longitude;
      this.setState({
        minimum: min,
        marker:
          {
            coords: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude
            },
            title: "Driver: ",
            description: "You're here!"
          },
        coords: this.state.coords,
        slideState : this.state.slideState,
        slideState2 : this.state.slideState2,
        info: this.state.info
      })
    })

    this.getDirections = this.getDirections.bind(this);
    this.toggleSlide = this.toggleSlide.bind(this);
    this.toggleSlide2 = this.toggleSlide2.bind(this);
    this.callUber = this.callUber.bind(this);
    this.unlockCar = this.unlockCar.bind(this);
    this.alertCops = this.alertCops.bind(this);

    this.state = {
      minimum: 0,
      coords: [],
      marker: {
        coords: {
          latitude: 0,
          longitude: 0
        },
        title: "Wait",
        description: "For It"
      },
      slideState : false,
      slideState2 : false,
      info: {
        image: "",
        name: "Driver's Name",
        phone: 'Phone Number',
        model: 'Model / Make',
        license: 'License Plate'
      }
    }

    navigator.geolocation.getCurrentPosition((position) => {
      lat = parseFloat(position.coords.latitude)
      long = parseFloat(position.coords.longitude)

      this.setState({
        minimum: 0,
        coords: [],
        marker: {
          coords: {
            latitude: lat,
            longitude: long
          },
          title: "You!",
          description: "You are here"
        },
        slideState : this.state.slideState,
        slideState2 : this.state.slideState2,
        info: this.state.info
      });
    });
  }

  toggleSlide() {
    this.setState({
      minimum: this.state.minimum,
      marker: this.state.marker,
      coords: this.state.coords,
      slideState : !this.state.slideState,
      slideState2 : this.state.slideState2,
      info: this.state.info
    })
  }

  toggleSlide2() {
    this.setState({
      minimum: this.state.minimum,
      marker: this.state.marker,
      coords: this.state.coords,
      slideState : this.state.slideState,
      slideState2 : !this.state.slideState2,
      info: this.state.info
    })
  }

  alertCops() {
    Alert.alert(
      'We can call the cops!',
      'Would you like that? Please confirm.',
      [
        { text: 'Call the cops!',
          onPress: () => {
            this.socket.emit('twilio', {
              lt: lat,
              lg: long
            });
          }
        },
        {
          text: "Cancel",
          onPress: () => {
          },
          style: 'cancel'
        }
      ],
      {cancelable: false},
    );

  }

  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyBFb-ijeIhz4nmGHusKruKaizPOYDsVipU`)
        let respJson = await resp.json();
        let undecoded = respJson.routes[0].overview_polyline.points;
        let points = Polyline.decode(undecoded);
        this.socket.emit('line', {
          line: undecoded
        });

        let coords = points.map((point, index) => {
          return  {
            latitude : point[0],
            longitude : point[1]
          }
        })

        this.setState({
          minimum: this.state.minimum,
          marker: this.state.marker,
          coords: coords,
          slideState : this.state.slideState,
          slideState2 : this.state.slideState2,
          info: this.state.info
        })
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
      <View
        style={{
          position: 'absolute',
          zIndex: 1000,
          top: 80,
          right: 20,
          borderWidth: 0,
          shadowOffset:{  width: 0,  height: 2},
          shadowColor: 'black',
          shadowOpacity: 0.5,
          shadowRadius: 3
          }}
      >
        <Icon
          style={{ margin: 0 }}
          name="ios-person"
          color="#111E6C"
          size={50}
          onPress={this.toggleSlide}
        />
        <Icon
          style={{ margin: 0 }}
          name="ios-car"
          color="#111E6C"
          size={50}
          onPress={this.toggleSlide2}
        />
        <Icon
          style={{ margin: 0 }}
          name="ios-megaphone"
          color="#111E6C"
          size={50}
          onPress={this.alertCops}
        />
      </View>
        <MapView style={styles.map}
        initialRegion={{
          latitude:34.0522,
          longitude:-118.2437,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={mapStyle}
        provider={MapView.PROVIDER_GOOGLE}
        >

        <MapView.Marker
            coordinate={this.state.marker.coords}
            title={this.state.marker.title}
            description={this.state.marker.description}
            pinColor={'navy'}
            image={marker}
         />

        <MapView.Polyline
          coordinates={this.state.coords}
          strokeWidth={4}
          strokeColor="#111E6C"/>
        </MapView>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            alignSelf: 'center',
            zIndex: 100,
            backgroundColor: '#111E6C',
            borderWidth: 0,
            shadowOffset:{  width: 0,  height: 2},
            shadowColor: 'black',
            shadowOpacity: 0.5,
            shadowRadius: 3,
            padding: 20,
            textAlign: 'right'
            }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              textAlign: 'right'
            }}
          >
          {this.state.minimum} meters off course
          </Text>
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
          color="#111E6C"
          buttonStyle={styles.button}
          accessibilityLabel="Learn more about this purple button"/>
        </View>
        <About
          slide={this.state.slideState}
          url={'https://i.imgur.com/b0hbcmE.jpg'}
          header={'Zirui Wang'}
          text1={'(123) 456-7890'}
          text2={'7652 Palmilla Drive'}
          text3={'San Diego, CA'}
          >
        </About>
        <About
          slide={this.state.slideState2}
          url={this.state.info.image}
          header={this.state.info.name}
          text1={this.state.info.phone}
          text2={this.state.info.model}
          text3={this.state.info.license}
          >
        </About>
      </View>
    );
  }
}
