//Handles AsyncStorage save and retrieve data from localstorage.

import { AsyncStorage } from "react-native";
const _storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    //console.log("saved data: ", key);
  } catch (error) { }
};

const _retrieveData = async key => {
  let data = await AsyncStorage.getItem(key);
  return JSON.parse(data);
};

const clearAllData = () => {
  AsyncStorage.clear();
};

export { _storeData, _retrieveData, clearAllData };
