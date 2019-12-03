import React, { Component } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { _retrieveData, _storeData } from "../../utils/AsyncStorageHandler";
import Header from "../../components/Header";
import NewBoard from "../../components/NewBoard";

export default class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Game" navigation={this.props.navigation} />
        <NewBoard />
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
