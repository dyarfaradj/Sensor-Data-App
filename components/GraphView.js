import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  VictoryLine,
  VictoryZoomContainer,
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
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
      let stateDataX = state.dataX;
      let stateDataY = state.dataY;
      let stateDataZ = state.dataZ;
      stateDataX.push({
        x: counter,
        y: x,
        l: "red"
      });
      stateDataY.push({
        x: counter,
        y: y,
        l: "green"
      });
      stateDataZ.push({
        x: counter,
        y: z,
        l: "blue"
      });

      if (counter >= 10 && counter % 5 == 0) {
        stateDataX.shift();
        stateDataY.shift();
        stateDataZ.shift();
      } else if (counter >= 50) {
        stateDataX.shift();
        stateDataY.shift();
        stateDataZ.shift();
      }

      return {
        dataX: stateDataX,
        dataY: stateDataY,
        dataZ: stateDataZ,
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
        <VictoryChart width={370} theme={VictoryTheme.material}>
          <VictoryAxis
            domain={{ y: [3, -3] }}
            style={{
              axis: { display: "none" },
              ticks: { display: "none" },
              tickLabels: { display: "none" }
            }}
          />
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
        </VictoryChart>
        <Text>gravitational force in G (9.81 m s^-2):</Text>
        <Text>
          {"\n"}
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
