import React, { Component } from "react";
import SettingsPage from "./pages/SettingsPage";

export default class HomeScreen extends Component {
  render() {
    return <SettingsPage navigation={this.props.navigation} />;
  }
}
