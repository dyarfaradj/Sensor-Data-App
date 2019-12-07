import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  VictoryLine,
  VictoryZoomContainer,
  VictoryChart,
  VictoryTheme
} from "victory-native";

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
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
      let g = Math.sqrt(
        Math.pow(x, 2) + Math.pow(z, 2) + Math.pow(y, 2)
      ).toFixed(3);
      let counter = state.data.counter;
      return {
        data: [
          ...state.data,
          {
            x: counter,
            y: y,
            l: "red"
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
        <VictoryChart
          domain={{ y: [-5, 5] }}
          domainPadding={{ y: 5 }}
          containerComponent={
            <VictoryZoomContainer
              zoomDomain={{
                x: [this.state.counter - 10, this.state.counter],
                y: [-5, 5]
              }}
            />
          }
          width={350}
          theme={VictoryTheme.material}
        >
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" }
            }}
            data={this.state.data}
          />
        </VictoryChart>
        <Text>gravitational force in G ():</Text>
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
