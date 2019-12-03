import React, { useState, useEffect, useRef } from "react";
import NewNode from "./NewNode";
import AIPlayer from "./AIPlayer";
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  Dimensions
} from "react-native";
import { defaultData } from "../utils/DefaultData";
import * as NineMensMorriesAction from "../actions/NineMensMorriesAction";
import nineMensMorriesStore from "../stores/NineMensMorriesStore";

export default function NewBoard() {
  const [isPlayingAgainstAI, setIsPlayingAgainstAI] = useState(
    nineMensMorriesStore.getGame().isPlayingAgainstAI
  );
  const [currentPlayer, setCurrentPlayer] = useState(
    nineMensMorriesStore.getCurrentPlayer()
  );
  const [board, setBoard] = useState(nineMensMorriesStore.getBoardState());
  const [gamePhase, setGamePhase] = useState(
    nineMensMorriesStore.getGamePhase()
  );
  const [nodePlaced, setNodePlaced] = useState(
    nineMensMorriesStore.getNodePlaced()
  );
  const [combos, setCombos] = useState(defaultData.combos);
  const [gameStatus, setGameStatus] = useState(
    nineMensMorriesStore.getGameStatus()
  );
  const [hasGameStarted, setHasGameStarted] = useState(
    nineMensMorriesStore.getHasGameStarted()
  );
  const [nodeStartPos, setNodeStartPos] = useState(
    nineMensMorriesStore.getStartPosNodes()
  );

  const [orientation, setOrientation] = useState("");

  const [infoStatus, setInfoStatus] = useState(
    nineMensMorriesStore.getInfoStatus()
      ? nineMensMorriesStore.getInfoStatus()
      : "No Game Has Started"
  );
  let aiRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ]);
  useEffect(() => {
    Dimensions.addEventListener("change", () => {
      setOrientation(isLandscape() ? "landscape" : "portrait");
    });
    nineMensMorriesStore.on("changeGame", getGameData);
    nineMensMorriesStore.on("hasGameStarted", getHasGameStartedData);
    nineMensMorriesStore.on("changeBoardState", getBoardStateData);
    nineMensMorriesStore.on("changeCurrentPlayer", getCurrentPlayerData);
    nineMensMorriesStore.on("changeGamePhase", getGamePhaseData);
    nineMensMorriesStore.on("changeInfoStatus", getInfoStatusData);
    nineMensMorriesStore.on("changeNodePlaced", getNodePlacedData);
    nineMensMorriesStore.on("changeNodePositions", getNodePositions);
    // aiRefs.current[0].current.focus();
  }, []);

  useEffect(() => {
    return () => {
      nineMensMorriesStore.removeListener("changeGame", getGameData);
      nineMensMorriesStore.removeListener(
        "hasGameStarted",
        getHasGameStartedData
      );
      nineMensMorriesStore.removeListener(
        "changeBoardState",
        getBoardStateData
      );
      nineMensMorriesStore.removeListener(
        "changeCurrentPlayer",
        getCurrentPlayerData
      );
      nineMensMorriesStore.removeListener(
        "changeInfoStatus",
        getInfoStatusData
      );
      nineMensMorriesStore.removeListener("changeGamePhase", getGamePhaseData);
      nineMensMorriesStore.removeListener(
        "changeNodePlaced",
        getNodePlacedData
      );
      nineMensMorriesStore.removeListener(
        "changeNodePositions",
        getNodePositions
      );
    };
  }, []);

  getGameData = () => {
    let gameData = nineMensMorriesStore.getGame();
    setBoard(gameData.boardState);
    setCurrentPlayer(gameData.currentPlayer);
    setGamePhase(gameData.gamePhase);
    setInfoStatus(gameData.infoStatus);
    setGameStatus(gameData.gameStatus);
    setNodeStartPos(gameData.startPosNodes);
    setIsPlayingAgainstAI(gameData.isPlayingAgainstAI);
  };

  getBoardStateData = () => {
    setBoard(nineMensMorriesStore.getBoardState());
  };

  getCurrentPlayerData = () => {
    setCurrentPlayer(nineMensMorriesStore.getCurrentPlayer());
  };

  getGamePhaseData = () => {
    setGamePhase(nineMensMorriesStore.getGamePhase());
  };

  getInfoStatusData = () => {
    setInfoStatus(nineMensMorriesStore.getInfoStatus());
  };

  getHasGameStartedData = () => {
    setHasGameStarted(nineMensMorriesStore.getHasGameStarted());
  };

  getNodePlacedData = () => {
    setNodePlaced(nineMensMorriesStore.getNodePlaced());
  };

  getNodePositions = () => {
    setNodeStartPos(nineMensMorriesStore.getStartPosNodes());
  };

  const placeMens = nodeIndex => {
    if (gamePhase == 1) {
      NineMensMorriesAction.saveInfoStatus(
        "Player: " +
          currentPlayer +
          " placed a men on position " +
          nodeIndex +
          "!"
      );

      // Placera a men on board
      if (placeAMen(nodeIndex)) {
        //Increase nr of placed mens.
        NineMensMorriesAction.saveNodePlaced(nodePlaced + 1);
      }

      //Checka ifall vi har en kombo
      if (isLegalCombo(nodeIndex) == true) {
        alert("WE HAVE A COMBO");
        NineMensMorriesAction.saveGameStatus("remove");
      } else {
        NineMensMorriesAction.saveCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        if (isPlayingAgainstAI) {
          aiPlay();
        }
      }
      //Ifall alla men är plaserade då börja med spelet fas 2
      if (nineMensMorriesStore.getNodePlaced() == 18) {
        NineMensMorriesAction.saveGamePhase(2);
        NineMensMorriesAction.saveInfoStatus("PHASE 2 BEGINS NOW!");
        alert("PHASE 2 BEGINS NOW!");
      }
    } else if (gamePhase == 2) {
      if (isLegalCombo(nodeIndex) == true) {
        alert("WE HAVE A COMBO");
        NineMensMorriesAction.saveGameStatus("remove");
      } else {
        NineMensMorriesAction.saveCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        if (isPlayingAgainstAI) {
          aiPlay();
        }
      }
    }

    printBoard();
    console.log("tOTAL NoDEs plaCEd: " + nodePlaced);
  };

  // sätt in vilken/vart men är plaserad
  const placeAMen = nodeIndex => {
    if (gamePhase == 1) {
      board[nodeIndex].ownedBy = currentPlayer;
      NineMensMorriesAction.saveBoardState(board);
      updateTotNotPlacedMens(currentPlayer);
      return true;
    } else if (gamePhase == 2) {
      return false;
    }
  };

  const updateTotNotPlacedMens = player => {
    let totNotPlacedMens = nineMensMorriesStore.getTotNotPlacedMens();
    console.log("PlayerScore " + player + ": " + totNotPlacedMens[player - 1]);
    totNotPlacedMens[player - 1] = totNotPlacedMens[player - 1] - 1;
    nineMensMorriesStore.saveTotNotPlacedMens(totNotPlacedMens);
  };

  const wichPlayerIs = curPos => {
    return board[curPos].ownedBy;
  };

  const isLegalCombo = curPos => {
    let tmp = wichPlayerIs(curPos);
    let correct = 0;
    let tmp1;
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 3; j++) {
        if (curPos == combos[i][j]) {
          for (let r = 0; r < 3; r++) {
            tmp1 = combos[i][r];
            if (wichPlayerIs(tmp1) == tmp) {
              correct++;
              if (correct == 3) {
                return true;
              }
            }
          }
          correct = 0;
        }
      }
    }
    return false;
  };

  const updatePlayerScore = player => {
    let playerScore = nineMensMorriesStore.getPlayerScore();
    console.log("PlayerScore " + player + ": " + playerScore[player - 1]);
    playerScore[player - 1] = playerScore[player - 1] + 1;
    nineMensMorriesStore.savePlayerScore(playerScore);
  };

  const removeMen = removePos => {
    if (board[removePos] === 0) {
      return false;
    }
    if (isLegalCombo(removePos)) {
      if (isPosibleToRemoveCombos(removePos)) {
        if (board[removePos] === 0) {
          return false;
        } else {
          board[removePos].ownedBy = 0;
          NineMensMorriesAction.saveBoardState(board);
          NineMensMorriesAction.saveGameStatus("none");
          updatePlayerScore(nineMensMorriesStore.getCurrentPlayer());
          NineMensMorriesAction.saveCurrentPlayer(currentPlayer === 1 ? 2 : 1);
          if (isPlayingAgainstAI) {
            aiPlay();
          }
          isGameOver();
          return true;
        }
      } else {
        return false;
      }
    } else {
      board[removePos].ownedBy = 0;
      NineMensMorriesAction.saveBoardState(board);
      NineMensMorriesAction.saveGameStatus("none");
      updatePlayerScore(nineMensMorriesStore.getCurrentPlayer());
      NineMensMorriesAction.saveCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      if (isPlayingAgainstAI) {
        aiPlay();
      }
      isGameOver();
      return true;
    }
  };

  const isPosibleToRemoveCombos = removePos => {
    let tmp = board[removePos].ownedBy;
    let counter = 0;
    let counter2 = 0;
    for (let i = 0; i < 24; i++) {
      if (board[i].ownedBy === tmp) {
        if (isLegalCombo(i) === true) {
          counter++;
        }
        counter2++;
      }
    }
    if (counter2 > counter) {
      return false;
    } else return true;
  };

  const isGameOver = () => {
    if (nodePlaced === 19) {
      if (noOfPlayer(1) < 3 || noOfPlayer(2) < 3) {
        let playerWhoWon = whoWon();
        alert("Player " + playerWhoWon + " won the game!!!");
        return true;
      }
    }
    return false;
  };

  const whoWon = () => {
    return noOfPlayer(1) ? 2 : 1;
  };

  const noOfPlayer = playerID => {
    let counter = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i].ownedBy == playerID) {
        counter++;
      }
    }
    return counter;
  };

  const aiPlay = () => {
    setTimeout(() => {
      for (let i = 0; i < aiRefs.current.length; i++) {
        if (aiRefs.current[i].current.doAIMove()) {
          break;
        }
      }
    }, 500);
  };

  const printBoard = () => {
    console.log(
      " * " +
        board[0].ownedBy +
        "------------" +
        board[1].ownedBy +
        "------------" +
        board[2].ownedBy +
        "\n" +
        " * |            |            |\n" +
        " * |     " +
        board[3].ownedBy +
        "------" +
        board[4].ownedBy +
        "------" +
        board[5].ownedBy +
        "     |\n" +
        " * |     |      |      |     |\n" +
        " * |     |  " +
        board[6].ownedBy +
        "---" +
        board[7].ownedBy +
        "---" +
        board[8].ownedBy +
        "  |     |\n" +
        " * |     |  |       |  |     |\n" +
        " * " +
        board[9].ownedBy +
        "-----" +
        board[10].ownedBy +
        "--" +
        board[11].ownedBy +
        "       " +
        board[12].ownedBy +
        "--" +
        board[13].ownedBy +
        "-----" +
        board[14].ownedBy +
        "\n" +
        " * |     |  |       |  |     |\n" +
        " * |     |  " +
        board[15].ownedBy +
        "---" +
        board[16].ownedBy +
        "---" +
        board[17].ownedBy +
        "  |     |\n" +
        " * |     |      |      |     |\n" +
        " * |     " +
        board[18].ownedBy +
        "------" +
        board[19].ownedBy +
        "------" +
        board[20].ownedBy +
        "     |\n" +
        " * |            |            |\n" +
        " * " +
        board[21].ownedBy +
        "------------" +
        board[22].ownedBy +
        "------------" +
        board[23].ownedBy +
        ""
    );
    let playerScore = nineMensMorriesStore.getPlayerScore();
    let TotNotPlacedMens = nineMensMorriesStore.getTotNotPlacedMens();
  };

  const isLandscape = () => {
    const dim = Dimensions.get("screen");
    if (dim.width >= dim.height) {
      nineMensMorriesStore.saveIsLandScape(true);
    } else {
      nineMensMorriesStore.saveIsLandScape(false);
    }
    return dim.width >= dim.height;
  };

  let counter = 0;
  return (
    <SafeAreaView style={styles.bigContainer}>
      {hasGameStarted && board && (
        <View style={styles.container}>
          <Image
            style={{ width: 300, height: 299, position: "absolute" }}
            source={require("../assets/Board1.png")}
          />
          <View style={styles.firstBox}>
            {nodeStartPos.map((item, i) => (
              <React.Fragment key={i}>
                {isPlayingAgainstAI && item.ownedBy === 2 ? (
                  <AIPlayer
                    ref={aiRefs.current[counter++]}
                    nodeNumber={i}
                    key={"cell" + i}
                    controllingPlayer={item.ownedBy}
                    position={item.pos}
                    iAmAtPosition={item.iAmAtPosition}
                    onClick={placeMens}
                    lanPosition={item.posLan}
                    removeMen={removeMen}
                    isLegalCombo={isLegalCombo}
                  />
                ) : (
                  <NewNode
                    nodeNumber={i}
                    key={"cell" + i}
                    controllingPlayer={item.ownedBy}
                    position={item.pos}
                    iAmAtPosition={item.iAmAtPosition}
                    onClick={placeMens}
                    removeMen={removeMen}
                    isPlayingAgainstAI={isPlayingAgainstAI}
                    lanPosition={item.posLan}
                    isLandscape={orientation === "landscape" ? true : false}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
          <Image
            style={
              orientation === "landscape" ? styles.player1L : styles.player1
            }
            source={require("../assets/Player_1.png")}
          />
          <Image
            style={
              orientation === "landscape" ? styles.player2L : styles.player2
            }
            source={require("../assets/Player_2.png")}
          />
          <Image
         style={
           orientation === "landscape" ? styles.scorePlayer2L : styles.scorePlayer2
         }
         source={require("../assets/Score.png")}
        />
          <Text style={orientation === "landscape" ? styles.Score1L : styles.Score1} >{nineMensMorriesStore.getPlayerScore()[0]}</Text>
          <Image
          style={
            orientation === "landscape" ? styles.scorePlayer1L : styles.scorePlayer1
          }
          source={require("../assets/Score.png")}
        />
          <Text style={orientation === "landscape" ? styles.Score2L : styles.Score2} >{nineMensMorriesStore.getPlayerScore()[1]}</Text>
        </View>
      )}
      <Text style={orientation === "landscape" ? styles.textL : styles.text}>
        {infoStatus}
      </Text>
      {isPlayingAgainstAI && (
        <Text style={orientation === "landscape" ? styles.textL : styles.text}>
          You are playing against AI!
        </Text>
      )}
      <Text style={orientation === "landscape" ? styles.textL : styles.text}>
        {nodePlaced}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center"
  },
  bigContainer: {
    backgroundColor: "black",
    height: "100%"
  },
  bigContainer2: {
    backgroundColor: "white",
    height: "100%"
  },
  firstBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 310,
    height: 310
  },
  text: {
    top: 20,
    alignItems: "center",
    color: "white"
  },
  text: {
    top: 20,
    alignItems: "center",
    color: "white"
  },
  textL: {
    top: 20,
    alignItems: "center",
    color: "white"
  },
  player1: {
    width: 110,
    height: 10,
    position: "absolute",
    top: 380,
    left: 40
  },
  player1L: {
    width: 110,
    height: 10,
    position: "absolute",
    top: 50,
    left: 50
  },
  player2: {
    width: 110,
    height: 10,
    position: "absolute",
    top: 380,
    left: 225
  },
  player2L: {
    width: 110,
    height: 10,
    position: "absolute",
    top: 50,
    right:0
  },
  scorePlayer1L: {
    width: 70,
    height: 10,
    position: "absolute",
    top: 200,
    left: 55
  },
  scorePlayer1: {
    width: 70,
    height: 10,
    position: "absolute",
    top: 500,
    left: 40
  },
  scorePlayer2L: {
    width: 70,
    height: 10,
    position: "absolute",
    top: 200,
    right:35
  },
  scorePlayer2: {
    width: 70,
    height: 10,
    position: "absolute",
    top: 500,
    right:60
  },
  Score1: {color:"#ff7f0e", fontSize: 20, top:491, left: 115, position: "absolute"},
  Score1L: {color:"#ff7f0e", fontSize: 20, top:192, left: 130, position: "absolute"},
  Score2: {color:"#ff7f0e", fontSize: 20, top:491, right: 43, position: "absolute"},
  Score2L: {color:"#ff7f0e", fontSize: 20, top:192, right: 18, position: "absolute"}

  
});
