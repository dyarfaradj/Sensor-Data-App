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
        <ScrollView >
          <View style={{ justifyContent: 'center',
            alignItems: 'center',
            flex:1,
            }}>
          
          <Image
            style={{ width: 350, height: 350,}}
            source={require("./../../assets/Old_PC.png")}
            />
          <TouchableOpacity
            style={{ justifyContent: 'center',
            alignItems: 'center',
            position:"absolute",
            top:100

          }}
            onPress={() => setNewGameModalVisible(true)}
          >
            <Image
            style={{ width: 150, height: 15}}
            source={require("./../../assets/New_game.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            title="Load saved game"
            style={{ justifyContent: 'center',
            alignItems: 'center',
             position:"absolute"
            }}
            onPress={() => setLoadGameModalVisible(true)}
          >
             <Image
            style={{ width: 200, height: 15}}
            source={require("./../../assets/Saved_game.png")}
            />
          </TouchableOpacity>


            </View>
          
          <Overlay
            isVisible={newGameModalVisible}
            onBackdropPress={() => setNewGameModalVisible(false)}
            style={{ justifyContent: 'center',
                alignItems: 'center',
                }}
          >
            <View>
              <TouchableOpacity
                style={{ justifyContent: 'center',
                alignItems: 'center',
                margin: 5,
                top:40,
                
                }}
                onPress={() => onStartNewGame(false)}
              >
                <Image
                style={{ width: 200, height: 15}}
                source={require("./../../assets/Multiplayer.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ justifyContent: 'center',
                alignItems: 'center',
                margin: 5,
                top:40
                }}
                onPress={() => onStartNewGame(true)}
              >
                <Image
                style={{ width: 220, height: 15}}
                source={require("./../../assets/Single_Player.png")}
                />
              </TouchableOpacity>
            </View>
          </Overlay>

          <Overlay
            isVisible={loadGameModalVisible}
            onBackdropPress={() => setLoadGameModalVisible(false)}
          >
            <View>
              {nineMensMorriesStore.getSavedGames().map((item, index) => (
                <Text key={index} onPress={() => onLoadSavedGame(item.gameId)}>
                  {new Date(item.gameDate).toLocaleDateString(
                    "sv-SE",
                    dateOptions
                  )}
                </Text>
              ))}
            </View>
          </Overlay>
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
