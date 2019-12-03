import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
  Button,
  Image,
  TouchableOpacity
} from "react-native";
import { Overlay } from "react-native-elements";
import { _retrieveData, _storeData } from "../../utils/AsyncStorageHandler";
import Header from "../../components/Header";
import * as NineMensMorriesAction from "../../actions/NineMensMorriesAction";
import nineMensMorriesStore from "../../stores/NineMensMorriesStore";
import AccelerometerView from "../../components/AccelerometerView";
export default function FrontPage(props) {
  const [loadGameModalVisible, setLoadGameModalVisible] = useState(false);
  const [newGameModalVisible, setNewGameModalVisible] = useState(false);
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  };

  function onStartNewGame(isPlayingAgainstAI) {
    nineMensMorriesStore.loadNewGame(isPlayingAgainstAI);
    props.navigation.navigate("Game");
    setNewGameModalVisible(false);
  }

  const onLoadSavedGame = gameId => {
    nineMensMorriesStore.loadAGameToPlay(gameId);
    props.navigation.navigate("Game");
    setLoadGameModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Home" navigation={props.navigation} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
        <ScrollView>
          <AccelerometerView />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "black"
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#000000",
    width: "100%",
    height: 100,
    bottom: 0
  }
});
