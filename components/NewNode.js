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
    if (this.props.isLandscape) {
      if (this.state.iAmAtPosition === 99) {
        this.setState({
          pos: this.props.lanPosition,
          iAmAtPosition: this.props.iAmAtPosition
        });
      } else {
        this.setState({
          pos: this.props.position,
          iAmAtPosition: this.props.iAmAtPosition
        });
      }
    } else {
      this.setState({
        pos: this.props.position,
        iAmAtPosition: this.props.iAmAtPosition
      });
    }
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
          } else {
            alert("can't remove this , mill is formed! pick another one!");
          }
        } else {
          alert("YOU CAN'T REMOVE THIS MEN!");
        }
      } else {
        alert("YOU CAN'T REMOVE YOUR OWN MEN!");
      }
    } else {
      if (currentPlayer === this.props.controllingPlayer) {
        let validPosition = 99;
        let newPos = this.draggableRef.getPosition();

        if (gamePhase === 1 && this.state.iAmAtPosition === 99) {
          for (let i = 0; i < gameBoard.length; i++) {
            if (
              newPos.x.between(
                gameBoard[i].pos.xPos - 20,
                gameBoard[i].pos.xPos + 20
              ) &&
              newPos.y.between(
                gameBoard[i].pos.yPos - 20,
                gameBoard[i].pos.yPos + 20
              )
            ) {
              if (gameBoard[i].ownedBy === 0) {
                validPosition = i;
                this.setState({
                  pos: {
                    xPos: gameBoard[i].pos.xPos,
                    yPos: gameBoard[i].pos.yPos
                  },
                  iAmAtPosition: i
                });
                nodePositions[this.props.nodeNumber].pos.xPos =
                  gameBoard[i].pos.xPos;
                nodePositions[this.props.nodeNumber].pos.yPos =
                  gameBoard[i].pos.yPos;
                nodePositions[this.props.nodeNumber].iAmAtPosition = i;
                NineMensMorriesAction.saveNodePositions(nodePositions);
                console.log("this updated!");
              } else {
                alert("YOU CAN'T PLACE A MEN HERE");
              }
            } else {
              // console.log("NO!");
            }
          }
        } else if (gamePhase === 2) {
          if (this.shouldFly(currentPlayer) === true) {
            for (let i = 0; i < gameBoard.length; i++) {
              if (
                newPos.x.between(
                  gameBoard[i].pos.xPos - 20,
                  gameBoard[i].pos.xPos + 20
                ) &&
                newPos.y.between(
                  gameBoard[i].pos.yPos - 20,
                  gameBoard[i].pos.yPos + 20
                )
              ) {
                if (gameBoard[i].ownedBy === 0) {
                  this.placeAMen(i, gameData);
                  validPosition = i;
                  this.setState({
                    pos: {
                      xPos: gameBoard[i].pos.xPos,
                      yPos: gameBoard[i].pos.yPos
                    },
                    iAmAtPosition: i
                  });
                  nodePositions[this.props.nodeNumber].pos.xPos =
                    gameBoard[i].pos.xPos;
                  nodePositions[this.props.nodeNumber].pos.yPos =
                    gameBoard[i].pos.yPos;
                  nodePositions[this.props.nodeNumber].iAmAtPosition = i;
                  NineMensMorriesAction.saveNodePositions(nodePositions);
                }
              } else {
                // console.log("NO!");
              }
            }
          } else {
            console.log("utan fly mood");
            for (let i = 0; i < gameBoard.length; i++) {
              if (
                newPos.x.between(
                  gameBoard[i].pos.xPos - 20,
                  gameBoard[i].pos.xPos + 20
                ) &&
                newPos.y.between(
                  gameBoard[i].pos.yPos - 20,
                  gameBoard[i].pos.yPos + 20
                )
              ) {
                if (gameBoard[i].ownedBy === 0) {
                  if (this.isValidMove(i) == true) {
                    this.placeAMen(i, gameData);
                    validPosition = i;
                    this.setState({
                      pos: {
                        xPos: gameBoard[i].pos.xPos,
                        yPos: gameBoard[i].pos.yPos
                      },
                      iAmAtPosition: i
                    });
                    nodePositions[this.props.nodeNumber].pos.xPos =
                      gameBoard[i].pos.xPos;
                    nodePositions[this.props.nodeNumber].pos.yPos =
                      gameBoard[i].pos.yPos;
                    nodePositions[this.props.nodeNumber].iAmAtPosition = i;
                    NineMensMorriesAction.saveNodePositions(nodePositions);
                  } else {
                    alert("Not legal move");
                  }
                } else {
                  alert("YOU CAN'T PLACE A MEN HERE");
                }
              } else {
                // console.log("NO!");
              }
            }
          }
        } else {
          alert("YOU CAN'T MOVE A PLACED MEN!");
        }
        if (validPosition !== 99) {
          this.props.onClick(validPosition);
        }
      } else {
        alert("NOT YOUR TURN!");
      }
    }

    this.draggableRef.reversePosition();
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

  // checka ifall man kan flytta men till en viss node
  isValidMove = newPos => {
    let validMove = nineMensMorriesStore.getValidMoves();
    let nrOfMoves = validMove[this.state.iAmAtPosition].length;
    for (let i = 0; i < nrOfMoves; i++) {
      if (newPos == validMove[this.state.iAmAtPosition][i]) return true;
    }
    return false;
  };

  placeAMen = (nodeIndex, gameData) => {
    let gamePhase = gameData.gamePhase;
    let currentPlayer = gameData.currentPlayer;
    let gameBoard = gameData.boardState;

    if (gamePhase == 2) {
      gameBoard[nodeIndex].ownedBy = currentPlayer;
      gameBoard[this.state.iAmAtPosition].ownedBy = 0;
      NineMensMorriesAction.saveBoardState(gameBoard);
    }
  };

  saveOldPos = () => {
    let currentPos = this.draggableRef.getPosition();
    this.setState({
      pos: { xPos: currentPos.x, yPos: currentPos.y }
    });
  };

  change = pos => {
    this.setState({
      pos: pos
    });
  };

  render() {
    // if (this.props.isPlayingAgainstAI) {
    //   if (this.state.pos !== this.props.position) {
    //     this.change(this.props.position);
    //   }
    // }
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
          reverse={false}
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
