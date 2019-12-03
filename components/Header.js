import React, { Component } from "react";
import { StyleSheet, AppState } from "react-native";
import { Header, Icon } from "react-native-elements";
export default class NavigationMenu extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    appState: AppState.currentState
  };

  componentWillMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return (
      <Header
        containerStyle={{
          backgroundColor: "black",
          justifyContent: "space-around",
          height: 55
        }}
        statusBarProps={{ barStyle: "light-content" }}
        leftComponent={
          <Icon
            name="bars"
            type="font-awesome"
            color="#fff"
            onPress={() => this.props.navigation.openDrawer()}
          />
        }
        centerComponent={{ text: this.props.title, style: { color: "#fff" } }}
        // rightComponent={{ icon: "home", color: "#fff" }}
      />
    );
  }
}
