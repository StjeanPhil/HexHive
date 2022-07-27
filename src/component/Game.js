import React, { useEffect } from 'react'
import { flushSync } from 'react-dom';

//Component
import Title from './Title'
import Hive from './Hive'
import PlayerCard from './PlayerCard'

//Classes
import Node from '../classes/Node'
import Bug from '../classes/Bug'
import Player from '../classes/Player'


class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rules: 'default',
      gameGrid: [[new Node()]],
      players: [new Player("Player1", "white", true), new Player("Player2", "Black", false)],
      selectedNode: {
        "isSelect": false,
        "isInHand": false,
        "coord": ['', '']
      },
      currentPlayer: 0,
      isOddRowOffset: false
    }
  }


  //Restart the board
  gameStart = () => {
    var tempGrid = this.state.gameGrid
    tempGrid = [[new Node()]]
    this.setState({ gameGrid: tempGrid })
  }

  //fake function right now but will need 
  showAvailableNodes = (coord, location) => {
    var tempGrid = this.state.gameGrid
    for (var i = 0; i < tempGrid.length; i++) {
      for (var j = 0; j < tempGrid[0].length; j++) {
        if (tempGrid[i][j]) {
          tempGrid[i][j].isAvailable = true
        }
      }
    }
  }
  //fake function right now but will need 
  hideAvailableNodes = (coord, location) => {

  }
  //remove the selected status to the currently selected node( doesnt affect currentplayer)
  resetSelectedNode = () => {
    //remove the select status to the 
    var tempGrid = this.state.gameGrid
    var tempPlayers = this.state.players

    if (this.state.selectedNode.isSelect) {
      if (this.state.selectedNode.isInHand) {
        if (tempPlayers[this.state.currentPlayer].hand[this.state.selectedNode.coord[1]]) {
          tempPlayers[this.state.currentPlayer].hand[this.state.selectedNode.coord[1]].isSelected = false
        }

      }
      if (!this.state.selectedNode.isInHand) {
        tempGrid[this.state.selectedNode.coord[0]][this.state.selectedNode.coord[1]].isSelected = false
      }

      this.hideAvailableNodes(this.state.selectedNode.coord)

      //Flush sync makes sure the selectedNode state gets reset before any other code goes through
      flushSync(() => {
        this.setState({
          gameGrid: tempGrid,
          selectedNode: {
            "isSelect": false,
            "isInHand": false,
            "coord": ['', '']
          },
          players: tempPlayers
        })
      });
      console.log("Reset Selected Node::")
      console.log(this.state.selectedNode)

    }
  }
  setSelectedNode = (coord, isInHand) => {

    var tempSelectedNode = this.state.selectedNode
    var tempGrid = this.state.gameGrid
    //console.log("isInHand: " + isInHand)
    isInHand = (isInHand === 'hand' ? true : false)

    //remove the oldNode
    this.resetSelectedNode()


    //Select the new Node
    if (!isInHand) {
      tempGrid[coord[0]][coord[1]].isSelected = true
    }
    if (isInHand) {
      var tempPlayers = this.state.players
      tempPlayers[this.state.currentPlayer].hand[coord[1]].isSelected = true
    }
    //Take note of the new SelectedNode
    tempSelectedNode.isSelect = true
    tempSelectedNode.coord = coord
    tempSelectedNode.isInHand = isInHand



    flushSync(() => {
      this.setState({ selectedNode: tempSelectedNode })
    })
    console.log("Select Selected Node:")
    console.log(this.state.selectedNode)

  }
  //handle the clicking of an hex whether in hand or in board
  hexClick = (coord, location) => {

    if (location === 'hive') {
      //If there was no selected node, select the clicked node
      if (!this.state.selectedNode.isSelect) {
        this.setSelectedNode(coord, 'hive')
        this.showAvailableNodes(coord, 'hive')
        return
      }
      //if theres already a selected node,
      if (this.state.selectedNode.isSelect) {
        //if the selected node is in the player hand
        if (this.state.selectedNode.isInHand) {
          //if the clicked node is a valid move for the selected node
          if (this.state.gameGrid[coord[0]][coord[1]].isAvailable) {
            this.place_bug(this.state.selectedNode.coord, coord, this.state.currentPlayer)
            return
          }
          if (!(this.state.gameGrid[coord[0]][coord[1]].isAvailable)) {
            this.resetSelectedNode()
            return
          }
        }
        if (!this.state.selectedNode.isInHand) {
          //if the clicked node a valid move for the selected ndoe
          if (this.state.gameGrid[coord[0]][coord[1]].isAvailable) {
            //move selected node at clicked node location
            this.move_bug(this.state.selectedNode.coord, coord, this.state.currentPlayer)
            return
          }
          //If its not a valid move
          if (!this.state.gameGrid[coord[0]][coord[1]].isAvailable) {
            //clicked node is now selected node
            this.setSelectedNode(coord, 'hive')
            this.showAvailableNodes(coord, 'hive')
            return
          }
        }
      }
    }
    if (location === 'hand') {
      this.setSelectedNode(coord, 'hand')
      this.showAvailableNodes(coord, 'hand')
      return

    }

  }

  //Add all the hex that border the hex we just put on the coord passed in porp
  expandGrid = (coord) => {

    var row = coord[0]
    var col = coord[1]
    var rowAdded = false
    var colAdded = false

    //Make copy to modify
    var tempGrid = this.state.gameGrid
    var tempIsOddRowOffset = this.state.isOddRowOffset

    //activate the clicked node
    tempGrid[coord[0]][coord[1]].isBufferHex = false
    this.setState({ gameGrid: tempGrid })


    //If the first col is clicked, add col at the start of row arrays
    if (col === 0) {
      //For all the rows move add one col at the start
      for (var i = 0; i < tempGrid.length; i++) {
        tempGrid[i].unshift("")
      }
      //the clicked Hex is now situated 1 col further
      col += 1

      //dont forget to offset the selected node position to keep track of it
      var tempSelectedNode = this.state.selectedNode
      tempSelectedNode.coord[1] += 1
      this.setState({ selectedNode: tempSelectedNode })


    }
    //if the first row is clicked, add a new empty row as the starting row
    if (row === 0) {
      const newRow = new Array(tempGrid[0].length)
      tempGrid.unshift(newRow)
      //the clicked Hex is now situated 1 row down
      row += 1
      //rowAdded = true
      tempIsOddRowOffset = !tempIsOddRowOffset
      //dont forget to offset the selected node position to keep track of it
      var tempSelectedNode = this.state.selectedNode
      tempSelectedNode.coord[0] = 1
      this.setState({ selectedNode: tempSelectedNode })

    }
    if (col === (tempGrid[0].length - 1)) {
      for (var i = 0; i < tempGrid.length; i++) {
        tempGrid[i].push('')
      }
    }
    if (row === (tempGrid.length - 1)) {
      tempGrid.push(new Array(tempGrid[0].length))
    }
    //Add nodes around clicked node
    if ((((row % 2) !== 0) && !tempIsOddRowOffset) || (((row % 2) === 0) && tempIsOddRowOffset)) {
      if (!tempGrid[row - 1][col]) { tempGrid[row - 1][col] = new Node() }
      if (!tempGrid[row - 1][col + 1]) { tempGrid[row - 1][col + 1] = new Node() }

      if (!tempGrid[row][col - 1]) { tempGrid[row][col - 1] = new Node() }
      if (!tempGrid[row][col + 1]) { tempGrid[row][col + 1] = new Node() }

      if (!tempGrid[row + 1][col]) { tempGrid[row + 1][col] = new Node() }
      if (!tempGrid[row + 1][col + 1]) { tempGrid[row + 1][col + 1] = new Node() }
    }


    if ((((row % 2) == 0) && !tempIsOddRowOffset) || (((row % 2) !== 0) && tempIsOddRowOffset)) {
      if (!tempGrid[row - 1][col - 1]) { tempGrid[row - 1][col - 1] = new Node() }
      if (!tempGrid[row - 1][col]) { tempGrid[row - 1][col] = new Node() }

      if (!tempGrid[row][col - 1]) { tempGrid[row][col - 1] = new Node() }
      if (!tempGrid[row][col + 1]) { tempGrid[row][col + 1] = new Node() }

      if (!tempGrid[row + 1][col - 1]) { tempGrid[row + 1][col - 1] = new Node() }
      if (!tempGrid[row + 1][col]) { tempGrid[row + 1][col] = new Node() }
    }
    //this.keepGridSmall()
    this.setState({ gameGrid: tempGrid, isOddRowOffset: tempIsOddRowOffset })




  }
  keepGridSmall = () => {

    var tempGrid = this.state.gameGrid
    //remove the unconnected nodes
    for (var i = 0; i < tempGrid.length; i++) {
      for (var j = 0; j < tempGrid[0].length; j++) {
        //if there a node but its empty, check its connection to a bug
        if (tempGrid[i][j] && tempGrid[i][j].content.length < 1) {
          var foundConnectedBug = false
          //check Around the node for a node with a bug/with content
          if ((((i % 2) !== 0) && !this.state.isOddRowOffset) || (((i % 2) === 0) && this.state.isOddRowOffset)) {
            if (i > 0) {
              if (tempGrid[i - 1][j] && tempGrid[i - 1][j].content.length >= 1) { foundConnectedBug = true }
              if (j < (tempGrid[0].length - 1)) {
                if (tempGrid[i - 1][j + 1] && tempGrid[i - 1][j + 1].content.length >= 1) { foundConnectedBug = true }
              }
            }
            if (j < (tempGrid[0].length - 1)) {
              if (tempGrid[i][j + 1] && tempGrid[i][j + 1].content.length >= 1) { foundConnectedBug = true }
            }
            if (j > 0) {
              if (tempGrid[i][j - 1] && tempGrid[i][j - 1].content.length >= 1) { foundConnectedBug = true }
            }
            if (i < (tempGrid.length - 1)) {
              if (tempGrid[i + 1][j] && tempGrid[i + 1][j].content.length >= 1) { foundConnectedBug = true }
              if (j < tempGrid[0].length - 1) {
                if (tempGrid[i + 1][j + 1] && tempGrid[i + 1][j + 1].content.length >= 1) { foundConnectedBug = true }
              }
            }
          }
          if ((((i % 2) == 0) && !this.state.isOddRowOffset) || (((i % 2) !== 0) && this.state.isOddRowOffset)) {
            if (i > 0) {
              if (tempGrid[i - 1][j] && tempGrid[i - 1][j].content.length >= 1) { foundConnectedBug = true }
              if (j > 0) {
                if (tempGrid[i - 1][j - 1] && tempGrid[i - 1][j - 1].content.length >= 1) { foundConnectedBug = true }
              }
            }
            if (j > 0) {
              if (tempGrid[i][j - 1] && tempGrid[i][j - 1].content.length >= 1) { foundConnectedBug = true }
            }
            if (j < tempGrid[0].length - 1) {
              if (tempGrid[i][j + 1] && tempGrid[i][j + 1].content.length >= 1) { foundConnectedBug = true }
            }
            if (i < tempGrid.length - 1) {
              if (tempGrid[i + 1][j] && tempGrid[i + 1][j].content.length >= 1) { foundConnectedBug = true }
              if (j < tempGrid[0].length - 1) {
                if (tempGrid[i + 1][j - 1] && tempGrid[i + 1][j - 1].content.length >= 1) { foundConnectedBug = true }
              }
            }



          }
          console.log(foundConnectedBug)
          //if no connected bug, remove the node
          if (!foundConnectedBug) {
            console.log("remove one")
            tempGrid[i][j] = ''
          }

        }
      }
    }
    //check for empty borders
    //Check if top row empty,if empty remove first row
    var isEmpty = true
    for (var i = 0; i < tempGrid[0].length; i++) { if (tempGrid[0][i] && tempGrid[0][i].content) { isEmpty = false } }
    if (isEmpty) {
      console.log("hit")
      tempGrid.shift()
    }
    isEmpty = true
    //check if left col empty, if empty, remove first elem of each row
    for (var i = 0; i < tempGrid.length; i++) { if (tempGrid[i][0] && tempGrid[i][0].content) { isEmpty = false } }
    if (isEmpty) {
      for (var i = 0; i < tempGrid.length; i++) { tempGrid[i].shift() }
    }
    isEmpty = true
    //check if bot row empty, if empty remove last row
    for (var i = 0; i < tempGrid[0].length; i++) { if (tempGrid[tempGrid.length - 1][i] && tempGrid[tempGrid.length - 1][i].content) { isEmpty = false } }
    if (isEmpty) { tempGrid.pop() }
    isEmpty = true
    //check if right col empty,if empty remove the last elem of each row
    for (var i = 0; i < tempGrid.length; i++) { if (tempGrid[i][tempGrid[0].length - 1] && tempGrid[i][tempGrid[0].length - 1].content) { isEmpty = false } }
    if (isEmpty) {
      for (var i = 0; i < tempGrid.length; i++) { tempGrid[i].pop() }
    }

    this.setState({ gameGrid: tempGrid })
    console.log("minize tests done")
    return

  }
  //Move a bug already in play
  move_bug = (startNodeCoord, endNodeCoord, player) => {


    this.resetSelectedNode()

    var tempGrid = this.state.gameGrid
    if (tempGrid[startNodeCoord[0]][startNodeCoord[1]].content[0]) {
      tempGrid[endNodeCoord[0]][endNodeCoord[1]].content.unshift(tempGrid[startNodeCoord[0]][startNodeCoord[1]].content.shift())
      if (!tempGrid[startNodeCoord[0]][startNodeCoord[1]].content[0]) {
        tempGrid[startNodeCoord[0]][startNodeCoord[1]].isBufferHex = true
        //try to remove this flush sync if possible

        this.setState({ gameGrid: tempGrid })


      }

      this.expandGrid(endNodeCoord)

    }

    this.setState({ gameGrid: tempGrid, currentPlayer: (this.state.currentPlayer + 1) % 2 })


  }
  //Place a bug from the player's hand
  place_bug = (nodeCoordFromHand, endNodeCoord, player) => {
    this.resetSelectedNode()

    var tempGrid = this.state.gameGrid
    var tempPlayers = this.state.players
    //If theres stil a bug left in the selected node, remove it and place it in the enbdNodeCoord
    if (tempPlayers[player].hand[nodeCoordFromHand[1]].content[0]) {
      tempGrid[endNodeCoord[0]][endNodeCoord[1]].content.unshift(tempPlayers[player].hand[nodeCoordFromHand[1]].content.shift())
      this.expandGrid(endNodeCoord)
    }
    this.setState({ gameGrid: tempGrid, players: tempPlayers, currentPlayer: (this.state.currentPlayer + 1) % 2 })
  }
  //check passedGamegrid for complete and singular connection of the the bugs
  verifyConnection = (possibleGameGrid) => { }



  render() {
    return (
      <>
        <Title />
        <div className='Game'>

          <Hive gameGrid={this.state.gameGrid} isOddRowOffset={this.state.isOddRowOffset} hexClick={this.hexClick} />


          <div className='playerContainer'>
            <PlayerCard player={this.state.players[0]} rules={this.state.rules} hexClick={this.hexClick} />
            <PlayerCard player={this.state.players[1]} rules={this.state.rules} hexClick={this.hexClick} />
          </div>

        </div>



      </>)
  }

}

export default Game

//this.expandGrid([0, 0])