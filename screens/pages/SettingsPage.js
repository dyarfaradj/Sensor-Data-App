import React, { Component } from "react";
import { StyleSheet, View, Text, Switch, Slider,TouchableOpacity, Image,  } from "react-native";
import { _retrieveData, _storeData } from "../../utils/AsyncStorageHandler";
import Header from "../../components/Header";
import { menIcon } from "../../utils/ImageHandler";
import nineMensMorriesStore from "../../stores/NineMensMorriesStore";

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error1: "",
      ChoseMen:[nineMensMorriesStore.getSettings()[0], nineMensMorriesStore.getSettings()[1]],
    };
  }
  playerOne = data =>{
    let tmpArray = this.state.ChoseMen;
    tmpArray[0] = data;
    this.setState({
      ChoseMen: tmpArray,
    });
  }
  playerTwo = data =>{
    let tmpArray = this.state.ChoseMen;
    tmpArray[1] = data;
    this.setState({
      ChoseMen: tmpArray,
    });
  }

  submit = () =>{
    console.log("playerOne", this.state.ChoseMen);
    nineMensMorriesStore.saveSetting(this.state.ChoseMen);
  }
  render() {
    console.log("playerOne", nineMensMorriesStore.getSettings()[0]);
    console.log("playerTwo", nineMensMorriesStore.getSettings()[1]);

    return (
      <View style={styles.container}>
        <Header title="Settings" navigation={this.props.navigation} />
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsLabel}>Choose a men for player 1:</Text>
          <View style={styles.sliderContainer}>
            
            <TouchableOpacity
            onPress={() => this.playerOne(1)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_1.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => this.playerOne(2)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_2.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => this.playerOne(3)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_3.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => this.playerOne(4)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_4.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => this.playerOne(5)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_5.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => this.playerOne(6)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_6.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsLabel}>Choose a men for player 2: </Text>
          <View style={styles.sliderContainer}>
          <TouchableOpacity onPress={() => this.playerTwo(1)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_1.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.playerTwo(2)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_2.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.playerTwo(3)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_3.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.playerTwo(4)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_4.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.playerTwo(5)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_5.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.playerTwo(6)}>
              <Image
              style={{ width: 20, height: 20, right:5}}
              source={require("../../assets/Men_6.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.settingsLabel}>Player 1 men:</Text>
          <Image
          style={{ width: 20, height: 20, left:5}}
          source={menIcon[this.state.ChoseMen[0]]}
          />
          <Text style={styles.settingsLabel}>Player 2 men:</Text>
          <Image
          style={{ width: 20, height: 20, left:5}}
          source={menIcon[this.state.ChoseMen[1]]}
          />
        </View>
        <View style={styles.submitContainer}>
          <TouchableOpacity
              onPress={() => this.submit()}>
                <Image
                style={{ width: 150, height: 20}}
                source={require("../../assets/Submit.png")}
                />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  submitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
     margin: 5,
     top:40
  },
  settingsLabel: {
    marginLeft: 10
  },
  settingsComponent: {
    marginRight: 10,
    color: "white"
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 45,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black"
  },
  sliderText: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
    marginTop: 15
  },
  sliderContainer: {
    flexDirection: "row",
    top: 5,
  }
});
