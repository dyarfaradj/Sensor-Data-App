import dispatcher from "../dispatcher/dispatcher";
import { _retrieveData, _storeData } from "../utils/AsyncStorageHandler";
import { Alert } from "react-native";

export function saveBoardState(data) {
  dispatcher.dispatch({
    type: "SAVE_BOARD_STATE",
    data: data
  });
}

export function saveCurrentPlayer(data) {
  dispatcher.dispatch({
    type: "SAVE_CURRENT_PLAYER",
    data: data
  });
}

export function saveGameStatus(data) {
  dispatcher.dispatch({
    type: "SAVE_GAME_STATUS",
    data: data
  });
}

export function saveGamePhase(data) {
  dispatcher.dispatch({
    type: "SAVE_GAME_PHASE",
    data: data
  });
}

export function saveInfoStatus(data) {
  dispatcher.dispatch({
    type: "SAVE_INFO_STATUS",
    data: data
  });
}

export function saveNodePositions(data) {
  dispatcher.dispatch({
    type: "SAVE_NODE_POSITIONS",
    data: data
  });
}

export function saveGame(data) {
  dispatcher.dispatch({
    type: "SAVE_GAME",
    data: data
  });
}

export function saveNodePlaced(data) {
  dispatcher.dispatch({
    type: "SAVE_NODE_PLACED",
    data: data
  });
}
