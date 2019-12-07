import React, { Component } from "react";
import GraphPage from "./pages/GraphPage";

export default class GraphScreen extends Component {
  render() {
    return <GraphPage navigation={this.props.navigation} />;
  }
}
