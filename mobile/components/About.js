import React from "react";
import {Animated, Alert, StyleSheet, View, Dimensions, YellowBox} from "react-native";

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
   backgroundColor: 'white'
 }
});

export class About extends React.Component {
    state = {
      visible: false,
      x: new Animated.Value(500),
      notSlid: true
    };

    slide = () => {
      Animated.spring(this.state.x, {
        toValue: 0,
      }).start();
      this.setState({
        visible: true,
      });
    };

    unslide = () => {
      Animated.spring(this.state.x, {
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
            {/* your content, such as this.props.children */}
          </Animated.View>
        </View>
      );
    }
  }
