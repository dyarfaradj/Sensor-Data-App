import React, { Component } from "react";
import FrontPage from "./pages/FrontPage";

export default class HomeScreen extends Component {
  render() {
    return <FrontPage navigation={this.props.navigation} />;
  }
}
