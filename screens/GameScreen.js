import React, { Component } from "react";
import GamePage from "./pages/GamePage";

export default class GameScreen extends Component {
  render() {
    return <GamePage navigation={this.props.navigation} />;
  }
}
