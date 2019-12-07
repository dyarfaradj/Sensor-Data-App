import React from "react";
import { Gyroscope } from "expo-sensors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GraphView from "./GraphView";

export default class GyroscopeSensor extends React.Component {
  state = {
    gyroscopeData: {}
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
    Gyroscope.setUpdateInterval(1000);
  };

  _fast = () => {
    Gyroscope.setUpdateInterval(16);
  };

  _subscribe = () => {
    this._subscription = Gyroscope.addListener(result => {
      this.setState({ gyroscopeData: result });
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    let { x, y, z } = this.state.gyroscopeData;

    return (
      <GraphView title="Gyroscope Sensor" data={this.state.gyroscopeData} />
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
    marginTop: 15,
    paddingHorizontal: 10
  },
  text: {
    textAlign: "center"
  }
});
