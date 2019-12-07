import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  Slider,
  TouchableOpacity,
  Button
} from "react-native";
import { _retrieveData, _storeData } from "../../utils/AsyncStorageHandler";
import Header from "../../components/Header";
import sensorStore from "../../stores/SensorStore";
import GraphView from "../../components/GraphView";

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: sensorStore.getSetting()
    };
  }

  submit(value) {
    console.log("value: ", value);
    sensorStore.saveSetting(value);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Settings" navigation={this.props.navigation} />
        <Text>Current selected: {this.state.option}</Text>
        <Button onPress={() => this.submit(0)} title="Accelerometer"></Button>
        <Button onPress={() => this.submit(1)} title="Gyro"></Button>
        <Button onPress={() => this.submit(2)} title="Magno"></Button>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  submitContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    top: 40
  },
  settingsLabel: {
    marginLeft: 10
  },
  settingsComponent: {
    marginRight: 10,
    color: "white"
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 45,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black"
  },
  sliderText: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
    marginTop: 15
  },
  sliderContainer: {
    flexDirection: "row",
    top: 5
  }
});
