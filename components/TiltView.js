import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer } from "expo-sensors";
import { DeviceMotion } from "expo-sensors";

let SHAKE_THRESHOLD = 2.25;

export default class TiltView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accelerometerData: {},
      lastUpdate: 0,
      changeColor: "black",
      orientationValue: 0
    };
  }

  componentDidMount() {
    this._toggle();
    // DeviceMotion.addListener(({ orientation }) => {
    //   this._orientationDidChange(orientation);
    // });
  }

  componentWillUnmount() {
    this._unsubscribe();
    // DeviceMotion.removeAllListeners();
  }

  // _orientationDidChange(rotation) {
  //   if (this.state.orientationValue !== rotation) {
  //     console.log(rotation);
  //     this.setState({ orientationValue: rotation });
  //   }
  // }

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
      this.onShake(
        accelerometerData.x,
        accelerometerData.y,
        accelerometerData.z
      );
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  changeLastUpdate = n => {
    this.setState({ lastUpdate: n });
  };

  change = n => {
    if (!n) {
      return 0;
    }

    return (Math.floor(n * 100) / 100) * 0.9;
  };

  onShake(x, y, z) {
    let curTime = Date.now();

    if (curTime - this.state.lastUpdate > 1000) {
      let acceleration = Math.sqrt(x * x + x * x + x * x - 9.81);
      if (acceleration > SHAKE_THRESHOLD) {
        this.setState({ changeColor: "red" });
      } else {
        this.setState({ changeColor: "black", lastUpdate: 0 });
      }
      this.setState({ lastUpdate: curTime });
    }
  }

  render() {
    let { x, y, z } = this.state.accelerometerData;
    // if (this.state.orientationValue === 90) {
    //   y = y;
    //   x = x;
    // } else if (this.state.orientationValue === 0) {
    //   y = x;
    //   x = -y;
    // } else if (this.state.orientationValue === -90) {
    //   y = y;
    //   x = -x;
    // } else {
    //   y = y;
    //   x = -x;
    // }
    y = (
      Math.atan(
        round(y) / Math.sqrt(round(x) * round(x) + round(z) * round(z))
      ) *
      (-180 / Math.PI)
    ).toFixed(0);

    return (
      <View style={styles.sensor}>
        <Text
          style={{
            fontSize: 50,
            textAlign: "center",
            color: this.state.changeColor
          }}
        >
          Tilt:{"\n"}
          {y}°
        </Text>
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
    fontSize: 30,
    textAlign: "center"
  }
});
