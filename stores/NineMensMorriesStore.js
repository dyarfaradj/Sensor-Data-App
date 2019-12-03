import { EventEmitter } from "events";
import dispatcher from "../dispatcher/dispatcher";
import {
  _retrieveData,
  _storeData,
  clearAllData
} from "../utils/AsyncStorageHandler";
import { defaultData } from "../utils/DefaultData";

class NineMensMorriesStore extends EventEmitter {
  constructor() {
    super();
    this.savedGames = [];
    this.gameStarted = false;
    this.game = {};
    this.loadSavedGames();
  }

  loadNewGame(isPlayingAgainstAI) {
    this.gameStarted = true;
    this.game = {
      gameId:
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15),
      boardState: defaultData.boardState,
      startPosNodes: defaultData.startPosNodes,
      validMoves: defaultData.validMoves,
      currentPlayer: defaultData.currentPlayer,
      gameStatus: defaultData.gameStatus,
      gamePhase: defaultData.gamePhase,
      isPlayingAgainstAI: isPlayingAgainstAI,
      infoStatus: defaultData.infoStatus,
      gameInfo: defaultData.gameInfo,
      nodePlaced: 0,
      gameDate: Date.now()
    };
    this.isLandScape = false;
    this.emit("changeGame");
    this.emit("hasGameStarted");
  }

  loadSavedGames = async () => {
    //clearAllData();
    const retrievedData = await _retrieveData("games");
    if (retrievedData) this.savedGames = retrievedData;
  };

  saveGame() {
    var found = this.savedGames.some(item => item.gameId === this.game.gameId);
    if (found) {
      let indexOfGame = this.savedGames.findIndex(
        item => item.gameId === this.game.gameId
      );
      this.savedGames[indexOfGame] = this.game;
    } else {
      this.savedGames.push(this.game);
    }
    _storeData("games", this.savedGames);
  }

  loadAGameToPlay(gameId) {
    var found = this.savedGames.some(item => item.gameId === gameId);
    if (found) {
      let indexOfGame = this.savedGames.findIndex(
        item => item.gameId === gameId
      );
      this.gameStarted = true;
      this.game = this.savedGames[indexOfGame];
      this.emit("changeGame");
    }
  }

  saveIsLandScape(data) {
    this.isLandScape = data;
    this.emit("changeIsLandScape");
  }

  getIsLandScape() {
    return this.isLandScape;
  }

  saveBoardState(data) {
    this.game.boardState = data;
    this.saveGame();
  }
  saveCurrentPlayer(data) {
    this.game.currentPlayer = data;
    this.saveGame();
  }

  saveGameStatus(data) {
    this.game.gameStatus = data;
    this.saveGame();
  }

  saveGamePhase(data) {
    this.game.gamePhase = data;
    this.saveGame();
  }

  saveInfoStatus(data) {
    this.game.infoStatus = data;
    this.saveGame();
  }

  saveNodePositions(data) {
    this.game.startPosNodes = data;
    this.saveGame();
  }

  savePlayerScore(data) {
    this.game.gameInfo.playerScore = data;
    this.saveGame();
  }

  saveTotNotPlacedMens(data) {
    this.game.gameInfo.totNotPlacedMens = data;
    this.saveGame();
  }

  saveNodePlaced(data) {
    this.game.nodePlaced = data;
  }

  saveSetting(data) {
    defaultData.settings.menIcon = data;
  }

  getSettings() {
    return defaultData.settings.menIcon;
  }

  saveGameState(data) {
    this.game = data;
    this.saveGame();
  }
  getBoardState() {
    return this.game.boardState;
  }

  getStartPosNodes() {
    return this.game.startPosNodes;
  }

  getPlayerScore() {
    return this.game.gameInfo.playerScore;
  }

  getTotNotPlacedMens() {
    return this.game.gameInfo.totNotPlacedMens;
  }

  getValidMoves() {
    return this.game.validMoves;
  }

  getCurrentPlayer() {
    return this.game.currentPlayer;
  }

  getGameStatus() {
    return this.game.gameStatus;
  }

  getGamePhase() {
    return this.game.gamePhase;
  }

  getHasGameStarted() {
    return this.gameStarted;
  }

  getInfoStatus() {
    return this.game.infoStatus;
  }

  getSavedGames() {
    return this.savedGames;
  }

  getGame() {
    return this.game;
  }

  getNodePlaced() {
    return this.game.nodePlaced;
  }

  handelActions(action) {
    switch (action.type) {
      case "SAVE_BOARD_STATE": {
        this.saveBoardState(action.data);
        this.emit("changeBoardState");
        break;
      }
      case "SAVE_CURRENT_PLAYER": {
        this.saveCurrentPlayer(action.data);
        this.emit("changeCurrentPlayer");
        break;
      }
      case "SAVE_GAME_STATUS": {
        this.saveGameStatus(action.data);
        this.emit("changeGameStatus");
        break;
      }
      case "SAVE_GAME_PHASE": {
        this.saveGamePhase(action.data);
        this.emit("changeGamePhase");
        break;
      }
      case "SAVE_INFO_STATUS": {
        this.saveInfoStatus(action.data);
        this.emit("changeInfoStatus");
        break;
      }
      case "SAVE_NODE_POSITIONS": {
        this.saveNodePositions(action.data);
        this.emit("changeNodePositions");
        break;
      }
      case "SAVE_GAME": {
        this.saveGameState(action.data);
        this.emit("changeGame");
        break;
      }
      case "SAVE_NODE_PLACED": {
        this.saveNodePlaced(action.data);
        this.emit("changeNodePlaced");
        break;
      }
    }
  }
}

const nineMensMorriesStore = new NineMensMorriesStore();
dispatcher.register(
  nineMensMorriesStore.handelActions.bind(
    nineMensMorriesStore.setMaxListeners(0)
  )
);
export default nineMensMorriesStore;
