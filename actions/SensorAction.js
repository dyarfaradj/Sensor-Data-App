import dispatcher from "../dispatcher/dispatcher";
import { _retrieveData, _storeData } from "../utils/AsyncStorageHandler";
import { Alert } from "react-native";

export function saveSettings(data) {
  dispatcher.dispatch({
    type: "SAVE_SETTING",
    data: data
  });
}
