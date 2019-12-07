import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  VictoryLine,
  VictoryZoomContainer,
  VictoryChart,
  VictoryGroup,
  VictoryTheme
} from "victory-native";

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataX: [],
      dataY: [],
      dataZ: [],
      dataObj: {},
      counter: 0
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data) {
      let x = parseFloat(props.data.x).toFixed(3);
      let y = parseFloat(props.data.y).toFixed(3);
      let z = parseFloat(props.data.z).toFixed(3);
      //let g = Math.sqrt(x * x + y * y + z * z).toFixed(3);
      //   let g = Math.sqrt(
      //     Math.pow(x, 2) + Math.pow(z, 2) + Math.pow(y, 2)
      //   ).toFixed(3);
      let counter = state.counter;
      return {
        dataX: [
          ...state.dataX,
          {
            x: counter,
            y: x,
            l: "red"
          }
        ],
        dataY: [
          ...state.dataY,
          {
            x: counter,
            y: y,
            l: "green"
          }
        ],
        dataZ: [
          ...state.dataZ,
          {
            x: counter,
            y: z,
            l: "blue"
          }
        ],
        dataObj: { x: x, y: y, z: z },
        counter: counter + 1
      };
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Showing data for: {this.props.title} </Text>
        <VictoryGroup
          domain={{ y: [-5, 5] }}
          domainPadding={{ y: [1, -1] }}
          //   domainPadding={{ y: 5 }}
          width={350}
          theme={VictoryTheme.material}
        >
          <VictoryLine
            style={{
              data: { stroke: "red" }
            }}
            data={this.state.dataX}
          />
          <VictoryLine
            style={{
              data: { stroke: "green" }
            }}
            data={this.state.dataY}
          />
          <VictoryLine
            style={{
              data: { stroke: "blue" }
            }}
            data={this.state.dataZ}
          />
        </VictoryGroup>
        <Text>gravitational force in G (9.81 m s^-2):</Text>
        <Text>
          Acceleration: {this.state.dataObj.x} {this.state.dataObj.y}{" "}
          {this.state.dataObj.z}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff"
  }
});
