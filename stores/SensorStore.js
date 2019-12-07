import { EventEmitter } from "events";
import dispatcher from "../dispatcher/dispatcher";
import { _retrieveData, _storeData } from "../utils/AsyncStorageHandler";

class SensorStore extends EventEmitter {
  constructor() {
    super();
    this.setting = 0;
  }
  saveSetting(data) {
    this.setting = data;
  }

  getSetting() {
    return this.setting;
  }

  handelActions(action) {
    switch (action.type) {
      case "SAVE_SETTING": {
        this.saveSetting(action.data);
        this.emit("changeSetting");
        break;
      }
    }
  }
}

const sensorStore = new SensorStore();
dispatcher.register(
  sensorStore.handelActions.bind(sensorStore.setMaxListeners(0))
);
export default sensorStore;
