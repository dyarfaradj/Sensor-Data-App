import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { _retrieveData, _storeData } from "../../utils/AsyncStorageHandler";
import Header from "../../components/Header";
import GyroscopeView from "../../components/GyroscopeView";
import MagnetometerView from "../../components/MagnetometerView";
import AccelerometerView from "../../components/AccelerometerView";
import sensorStore from "../../stores/SensorStore";

export default class GraphPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: sensorStore.getSetting()
    };
  }

  componentWillMount() {
    sensorStore.on("changeSetting", this.getSettingData);
  }

  componentWillUnmount() {
    sensorStore.removeListener("changeSetting", this.getSettingData);
  }

  getSettingData = () => {
    this.setState({ option: sensorStore.getSetting() });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header title="Graph" navigation={this.props.navigation} />
        {this.state.option === 0 && <AccelerometerView />}
        {this.state.option === 1 && <GyroscopeView />}
        {this.state.option === 2 && <MagnetometerView />}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  }
});
