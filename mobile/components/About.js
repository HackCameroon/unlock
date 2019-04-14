import React from "react";
import {Animated, Alert, StyleSheet, View, Dimensions, YellowBox, Image, Easing} from "react-native";
import { Text} from 'react-native-elements';

const styles = StyleSheet.create({
 slideView: {
   zIndex: 10000,
   position: 'absolute',
   top: 0,
   left: 0,
   right: 0,
   bottom: 0,
   width: Dimensions.get('window').width,
   height: Dimensions.get('window').height,
   backgroundColor: 'white',
   justifyContent: 'center',
   alignItems: 'center'
 }
});

export class About extends React.Component {
    state = {
      visible: false,
      x: new Animated.Value(500),
      notSlid: true
    };

    slide = () => {
      Animated.timing(this.state.x, {
        duration: 1000,
        easing: Easing.back(),
        toValue: 0,
      }).start();
      this.setState({
        visible: true,
      });
    };

    unslide = () => {
      Animated.timing(this.state.x, {
        duration: 1000,
        toValue: 500,
      }).start();
      this.setState({
        visible: false,
      });
    };

    render() {
      // in practice you wanna toggle this.slide() after some props validation, I hope
     if(this.props.slide == true && this.state.notSlid) {
       this.slide();
       this.setState({
         notSlid: false
       })
     }

     if(!this.props.slide && !this.state.notSlid) {
       this.unslide();
       this.setState({
         notSlid: true
       })
     }

      return (
        <View>
          <Animated.View
            style={[styles.slideView, {
              transform: [
                {
                  translateX: this.state.x
                }
              ]
            }]}
          >
          <Image
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderColor: '#111E6C',
              borderWidth: 4
            }}
            source={{uri: this.props.url}}/>
            <Text
            style={{
              color: '#111E6C',
              fontSize: 40,
            }}>
              {this.props.header}
            </Text>
            <Text
            style={{
              color: '#242424',
              fontSize: 25,
            }}>
              {this.props.text1}
            </Text>
            <Text
            style={{
              color: '#242424',
              fontSize: 25,
            }}>
              {this.props.text2}
            </Text>
            <Text
            style={{
              color: '#242424',
              fontSize: 25,
            }}>
              {this.props.text3}
            </Text>
          </Animated.View>
        </View>
      );
    }
  }
