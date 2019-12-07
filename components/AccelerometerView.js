import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer } from "expo-sensors";

export default class AccelerometerSensor extends Component {
  state = {
    accelerometerData: {},
    lastUpdate:0,
    changeColor:'black'
  };

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };

  _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  

  changeLastUpdate = (n) => {
    this.setState({lastUpdate: n });
  };

  change = (n) => {
    if (!n) {
      return 0;
    }
  
    return (Math.floor(n * 100) / 100) * 0.9;
  };

  onShake(x,y,z) {
    let curTime = Date.now();
    let SHAKE_THRESHOLD = 2.25;
    if ((curTime - this.state.lastUpdate) > 1000) {
      //console.log("curTime - lastUpdate: " + (curTime - this.state.lastUpdate));

      let acceleration = Math.sqrt(x*x + x*x + x*x - 9.81);
      //console.log("curTime: " + curTime);
      //console.log("lastUpdate: " + this.state.lastUpdate);
      //console.log("curTime - lastUpdate: " + (curTime - this.state.lastUpdate));

      if (acceleration > SHAKE_THRESHOLD) { 
        this.setState({ changeColor: 'red'});
        console.log("Is shaking: " + acceleration);
      }else{
        this.setState({ changeColor: 'black'});
        this.setState({ lastUpdate: 0 });
      }
      this.changeLastUpdate(curTime);

    }
  };

  render() {
    let { x, y, z } = this.state.accelerometerData;
    this.onShake(x,y,z);
    return (
      <View style={styles.sensor}>
        <Text style={styles.text,{ color: this.state.changeColor }}>
          Accelerometer: (in Gs where 1 G = 9.81 m s^-2)
        </Text>
        <Text style={styles.text,{ color: this.state.changeColor }}>
          x: {
          (180 *( Math.atan( (round(x)/(Math.sqrt( (round(y)*round(y)) + (round(z)*round(z))))))))/Math.PI
          } 
           y: {
          (( Math.atan( (round(y)/(Math.sqrt( (round(x)*round(x)) + (round(z)*round(z)))))))) * (-180/Math.PI)
          }
           z: {
          (180 *( Math.atan( (round(z)/(Math.sqrt( (round(y)*round(y)) + (round(x)*round(x))))))))/Math.PI
          }
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this._slow}
            style={[styles.button, styles.middleButton]}
          >
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return (Math.floor(n * 100) / 100) * 0.9;
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc"
  },
  sensor: {
    marginTop: 45,
    paddingHorizontal: 10
  },
  text: {
    textAlign: "center",
  }
});
