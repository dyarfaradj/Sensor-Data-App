import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  ScrollView
} from "react-native";
import { _retrieveData, _storeData } from "../../utils/AsyncStorageHandler";
import Header from "../../components/Header";
import TiltView from "../../components/TiltView";
export default function FrontPage(props) {
  return (
    <View style={styles.container}>
      <Header title="Home" navigation={props.navigation} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
        <ScrollView>
          <TiltView />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white"
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
