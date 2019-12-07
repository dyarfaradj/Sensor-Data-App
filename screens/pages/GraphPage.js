import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { _retrieveData, _storeData } from "../../utils/AsyncStorageHandler";
import Header from "../../components/Header";
import GyroscopeView from "../../components/GyroscopeView";

export default class GraphPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Graph" navigation={this.props.navigation} />
        <GyroscopeView />
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
