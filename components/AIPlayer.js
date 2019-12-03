import React, { Component } from "react";
import Draggable from "react-native-draggable";
import * as NineMensMorriesAction from "../actions/NineMensMorriesAction";
import nineMensMorriesStore from "../stores/NineMensMorriesStore";
import { menIcon } from "../utils/ImageHandler";
export default class NewNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPos: {},
      boardState: nineMensMorriesStore.getBoardState(),
      pos: {},
      iAmAtPosition: 99
    };
    this.draggableRef = React.createRef();
  }

  componentWillMount() {
    this.setState({
      pos: this.props.position,
      iAmAtPosition: this.props.iAmAtPosition
    });
    nineMensMorriesStore.on("changeIsLandScape", this.getIsLandScapeData);
  }

  componentWillUnmount() {
    nineMensMorriesStore.removeListener(
      "changeIsLandScape",
      this.getIsLandScapeData
    );
  }

  getIsLandScapeData = () => {
    let isLandscape = nineMensMorriesStore.getIsLandScape();
    if (this.state.iAmAtPosition === 99) {
      if (isLandscape) {
        this.setState({
          pos: this.props.lanPosition
        });
      } else {
        this.setState({
          pos: this.props.position
        });
      }
    }
  };

  onNodeClick = () => {
    let gameData = nineMensMorriesStore.getGame();
    let currentPlayer = gameData.currentPlayer;
    let gamePhase = gameData.gamePhase;
    let gameBoard = gameData.boardState;
    let gameStatus = gameData.gameStatus;
    let nodePositions = gameData.startPosNodes;
    if (gameStatus === "remove") {
      if (currentPlayer !== this.props.controllingPlayer) {
        if (this.state.iAmAtPosition !== 99) {
          if (this.props.removeMen(this.state.iAmAtPosition)) {
            this.setState({
              pos: {
                xPos: 999,
                yPos: 999
              }
            });
            nodePositions[this.props.nodeNumber].pos.xPos = 999;
            nodePositions[this.props.nodeNumber].pos.yPos = 999;
            NineMensMorriesAction.saveNodePositions(nodePositions);
            NineMensMorriesAction.saveCurrentPlayer(1);
          } else {
            alert("can't remove this , mill is formed! pick another one!");
          }
        } else {
          alert("YOU CAN'T REMOVE THIS MEN!");
        }
      } else {
        alert("YOU CAN'T REMOVE YOUR OWN MEN!");
      }
    }
  };

  saveOldPos = () => {
    let currentPos = this.draggableRef.getPosition();
    this.setState({
      pos: { xPos: currentPos.x, yPos: currentPos.y }
    });
  };

  doAIMove() {
    let gameData = nineMensMorriesStore.getGame();
    let currentPlayer = gameData.currentPlayer;
    let gamePhase = gameData.gamePhase;
    let gameBoard = gameData.boardState;
    let gameStatus = gameData.gameStatus;
    let nodePositions = gameData.startPosNodes;
    let nodePlaced = gameData.nodePlaced;
    if (currentPlayer === 2 && this.props.controllingPlayer === 2) {
      if (nodePlaced === 18) {
        //Move Men
        return this.moveMen(
          gameBoard,
          nodePositions,
          currentPlayer,
          nodePlaced
        );
      } else if (nodePlaced < 18) {
        //Place men
        return this.placeMen(
          gameBoard,
          nodePositions,
          currentPlayer,
          nodePlaced
        );
      }
    }
    return false;
  }

  shuffle = array => {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  };

  placeMen = (gameBoard, nodePositions, currentPlayer, nodePlaced) => {
    if (this.state.iAmAtPosition === 99) {
      let listValidMoves = [];
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i].ownedBy === 0) {
          listValidMoves.push(i);
        }
      }
      let emptyPos = 99;
      listValidMoves = this.shuffle(listValidMoves);

      emptyPos = listValidMoves[0];
      this.setState({
        pos: {
          xPos: gameBoard[emptyPos].pos.xPos,
          yPos: gameBoard[emptyPos].pos.yPos
        },
        iAmAtPosition: emptyPos
      });

      nodePositions[this.props.nodeNumber].pos.xPos =
        gameBoard[emptyPos].pos.xPos;
      nodePositions[this.props.nodeNumber].pos.yPos =
        gameBoard[emptyPos].pos.yPos;
      nodePositions[this.props.nodeNumber].iAmAtPosition = emptyPos;
      gameBoard[emptyPos].ownedBy = currentPlayer;
      NineMensMorriesAction.saveNodePlaced(nodePlaced + 1);
      if (this.props.isLegalCombo(emptyPos)) {
        alert("AI GOT COMBO REMOVING NOW!");
        if (this.removeMen(gameBoard, nodePositions)) {
          NineMensMorriesAction.saveBoardState(gameBoard);
          NineMensMorriesAction.saveNodePositions(nodePositions);
          NineMensMorriesAction.saveCurrentPlayer(1);
        }
      } else {
        NineMensMorriesAction.saveBoardState(gameBoard);
        NineMensMorriesAction.saveNodePositions(nodePositions);
        NineMensMorriesAction.saveCurrentPlayer(1);
      }
      if (nineMensMorriesStore.getNodePlaced() == 18) {
        NineMensMorriesAction.saveGamePhase(2);
        NineMensMorriesAction.saveInfoStatus("PHASE 2 BEGINS NOW!");
      }
      return true;
    } else {
      return false;
    }
  };

  moveMen = (gameBoard, nodePositions, currentPlayer, nodePlaced) => {
    if (this.shouldFly(currentPlayer) === true) {
      let listValidMoves = [];
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i].ownedBy === 0) {
          listValidMoves.push(i);
        }
      }
      if (listValidMoves === undefined || listValidMoves.length == 0) {
        return false;
      } else {
        let emptyPos = getRandomInt(0, listValidMoves.length - 1);
        if (listValidMoves.length === 1) {
          emptyPos = listValidMoves[0];
        }
        gameBoard[emptyPos].ownedBy = currentPlayer;
        gameBoard[this.state.iAmAtPosition].ownedBy = 0;
        this.setState({
          pos: {
            xPos: gameBoard[emptyPos].pos.xPos,
            yPos: gameBoard[emptyPos].pos.yPos
          },
          iAmAtPosition: emptyPos
        });
        nodePositions[this.props.nodeNumber].pos.xPos =
          gameBoard[emptyPos].pos.xPos;
        nodePositions[this.props.nodeNumber].pos.yPos =
          gameBoard[emptyPos].pos.yPos;
        nodePositions[this.props.nodeNumber].iAmAtPosition = emptyPos;
        gameBoard[emptyPos].ownedBy = currentPlayer;
        if (this.props.isLegalCombo(emptyPos)) {
          alert("AI Got Combo, removing a men from you!");
          if (this.removeMen(gameBoard, nodePositions)) {
            NineMensMorriesAction.saveBoardState(gameBoard);
            NineMensMorriesAction.saveNodePositions(nodePositions);
            NineMensMorriesAction.saveCurrentPlayer(1);
          }
        } else {
          NineMensMorriesAction.saveBoardState(gameBoard);
          NineMensMorriesAction.saveNodePositions(nodePositions);
          NineMensMorriesAction.saveCurrentPlayer(1);
        }
      }
    } else {
      let listValidMoves = [];
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i].ownedBy === 0) {
          if (this.isValidMove(i) == true) {
            console.log("IS VALID: ", i);
            listValidMoves.push(i);
          }
        }
      }
      if (listValidMoves === undefined || listValidMoves.length == 0) {
        return false;
      } else {
        let emptyPos = listValidMoves[0];
        gameBoard[emptyPos].ownedBy = currentPlayer;
        gameBoard[this.state.iAmAtPosition].ownedBy = 0;
        this.setState({
          pos: {
            xPos: gameBoard[emptyPos].pos.xPos,
            yPos: gameBoard[emptyPos].pos.yPos
          },
          iAmAtPosition: emptyPos
        });
        nodePositions[this.props.nodeNumber].pos.xPos =
          gameBoard[emptyPos].pos.xPos;
        nodePositions[this.props.nodeNumber].pos.yPos =
          gameBoard[emptyPos].pos.yPos;
        nodePositions[this.props.nodeNumber].iAmAtPosition = emptyPos;
        gameBoard[emptyPos].ownedBy = currentPlayer;
        if (this.props.isLegalCombo(emptyPos)) {
          alert("AI Got Combo, removing a men from you!");
          if (this.removeMen(gameBoard, nodePositions)) {
            NineMensMorriesAction.saveBoardState(gameBoard);
            NineMensMorriesAction.saveNodePositions(nodePositions);
            NineMensMorriesAction.saveCurrentPlayer(1);
          }
        } else {
          NineMensMorriesAction.saveBoardState(gameBoard);
          NineMensMorriesAction.saveNodePositions(nodePositions);
          NineMensMorriesAction.saveCurrentPlayer(1);
        }
      }
    }
  };

  removeMen = (gameBoard, nodePositions) => {
    let menToRemove = 999;
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i].ownedBy === 1) {
        menToRemove = i;
      }
    }
    if (menToRemove !== 999) {
      for (let i = 0; i < nodePositions.length; i++) {
        if (
          nodePositions[i].pos.xPos === gameBoard[menToRemove].pos.xPos &&
          nodePositions[i].pos.yPos === gameBoard[menToRemove].pos.yPos
        ) {
          console.log("WILL REMOVE: " + menToRemove, " NODE POS: ", i);
          gameBoard[menToRemove].ownedBy = 0;
          nodePositions[i].pos.xPos = 999;
          nodePositions[i].pos.yPos = 999;
          NineMensMorriesAction.saveNodePositions(nodePositions);
          return true;
        }
      }
    }
    return false;
  };

  shouldFly = player => {
    if (player === 1) {
      player = 2;
    } else {
      player = 1;
    }
    if (nineMensMorriesStore.getPlayerScore()[player - 1] > 5) {
      return true;
    } else {
      return false;
    }
  };

  isValidMove = newPos => {
    let validMove = nineMensMorriesStore.getValidMoves();
    let nrOfMoves = validMove[this.state.iAmAtPosition].length;
    for (let i = 0; i < nrOfMoves; i++) {
      if (newPos == validMove[this.state.iAmAtPosition][i]) return true;
    }
    return false;
  };

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  render() {
    const player = this.props.controllingPlayer;
    let playerStyle = {};
    if (player == 0) {
      playerStyle.bkg = "rgba(52, 52, 52, 0)";
    } else if (player == 1) {
      playerStyle.bkg = menIcon[nineMensMorriesStore.getSettings()[0]];
    } else if (player == 2) {
      playerStyle.bkg = menIcon[nineMensMorriesStore.getSettings()[1]];
    }
    return (
      <>
        <Draggable
          ref={draggable => {
            this.draggableRef = draggable;
          }}
          className="node"
          renderSize={17}
          offsetX={0}
          offsetY={0}
          x={this.state.pos.xPos}
          y={this.state.pos.yPos}
          renderShape="image"
          imageSource={playerStyle.bkg}
          renderText=""
          pressInDrag={this.saveOldPos}
          pressDragRelease={this.onNodeClick}
          reverse={true}
        />
      </>
    );
  }
}

Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};
