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


  availableQueen = (grid, coord) => {
    // anybufferHex touching the queen
    var tempGrid = grid
    const row = coord[0]
    const col = coord[1]

    if (col > 0 && tempGrid[row][col - 1].isBufferHex) { tempGrid[row][col - 1].isAvailable = true }
    if (col < (tempGrid[row].length - 1) && tempGrid[row][col + 1].isBufferHex) { tempGrid[row][col + 1].isAvailable = true }
    if (row > 0 && tempGrid[row - 1][col].isBufferHex) { tempGrid[row - 1][col].isAvailable = true }
    if (row < (tempGrid.length - 1) && tempGrid[row + 1][col].isBufferHex) { tempGrid[row + 1][col].isAvailable = true }

    if (((row % 2) == 0 && !this.state.isOddRowOffset) || ((row % 2) != 0 && this.state.isOddRowOffset)) {
      if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && tempGrid[row - 1][col - 1].isBufferHex) { tempGrid[row - 1][col - 1].isAvailable = true }
      if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && tempGrid[row + 1][col - 1].isBufferHex) { tempGrid[row + 1][col - 1].isAvailable = true }
    }
    if (((row % 2) == 1 && !this.state.isOddRowOffset) || ((row % 2) == 0 && this.state.isOddRowOffset)) {
      if (col < (tempGrid[row].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && tempGrid[row - 1][col + 1].isBufferHex) { tempGrid[row - 1][col + 1].isAvailable = true }
      if (col < (tempGrid[row].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && tempGrid[row + 1][col + 1].isBufferHex) { tempGrid[row + 1][col + 1].isAvailable = true }
    }
    return tempGrid
  }
  availableSpider = (grid, coord, count, usedCoord) => {
    //exactly 3 hex from the spider, cant go up bug
    //toggle avalability when counter hits zero
    var tempGrid = grid
    const row = coord[0]
    const col = coord[1]
    //recursive ending
    if (count === 0) {
      tempGrid[row][col].isAvailable = true
      return tempGrid
    }
    count -= 1
    usedCoord += coord

    if (col > 0 && tempGrid[row][col - 1] && tempGrid[row][col - 1].isBufferHex) {
      if (!usedCoord.includes([row, col - 1])) {
        tempGrid = this.availableSpider(tempGrid, [row, col - 1], count, usedCoord)
      }

    }
    if (col < (tempGrid[row].length - 1) && tempGrid[row][col + 1] && tempGrid[row][col + 1].isBufferHex) {
      if (!usedCoord.includes([row, col + 1])) {
        tempGrid = this.availableSpider(tempGrid, [row, col + 1], count, usedCoord)
      }
    }
    if (row > 0 && tempGrid[row - 1][col] && tempGrid[row - 1][col].isBufferHex) {
      if (!usedCoord.includes([row - 1, col])) {
        tempGrid = this.availableSpider(tempGrid, [row - 1, col], count, usedCoord)
      }
    }
    if (row < (tempGrid.length - 1) && tempGrid[row + 1][col] && tempGrid[row + 1][col].isBufferHex) {
      if (!usedCoord.includes([row + 1, col])) {
        tempGrid = this.availableSpider(tempGrid, [row + 1, col], count, usedCoord)
      }
    }

    if (((row % 2) == 0 && !this.state.isOddRowOffset) || ((row % 2) != 0 && this.state.isOddRowOffset)) {
      if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && tempGrid[row - 1][col - 1].isBufferHex) {
        if (!usedCoord.includes([row - 1, col - 1])) {
          tempGrid = this.availableSpider(tempGrid, [row - 1, col - 1], count, usedCoord)
        }
      }
      if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && tempGrid[row + 1][col - 1].isBufferHex) {
        if (!usedCoord.includes([row + 1, col - 1])) {
          tempGrid = this.availableSpider(tempGrid, [row + 1, col - 1], count, usedCoord)
        }
      }
    }
    if (((row % 2) == 1 && !this.state.isOddRowOffset) || ((row % 2) == 0 && this.state.isOddRowOffset)) {
      if (col < (tempGrid[row].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && tempGrid[row - 1][col + 1].isBufferHex) {
        if (!usedCoord.includes([row - 1, col + 1])) {
          tempGrid = this.availableSpider(tempGrid, [row - 1, col + 1], count, usedCoord)
        }
      }
      if (col < (tempGrid[row].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && tempGrid[row + 1][col + 1].isBufferHex) {
        if (!usedCoord.includes([row + 1, col + 1])) {
          tempGrid = this.availableSpider(tempGrid, [row + 1, col + 1], count, usedCoord)
        }
      }
    }
    return tempGrid

  }
  //it no works
  availableGrasshop = (grid, coord) => {
    // anybufferHex touching the queen
    var tempGrid = grid
    const row = coord[0]
    const col = coord[1]

    if (col > 0 && !tempGrid[row][col - 1].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row, col - 1], [0, -1]) }
    if (col < (tempGrid[row].length - 1) && !tempGrid[row][col + 1].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row, col + 1], [0, 1]) }

    //offset 
    if (((row % 2) == 0 && !this.state.isOddRowOffset) || ((row % 2) !== 0 && this.state.isOddRowOffset)) {
      if (row > 0 && !tempGrid[row - 1][col].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row - 1, col], [-1, 1]) }
      if (row < (tempGrid.length - 1) && !tempGrid[row + 1][col].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row + 1, col], [1, 1]) }
      if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && !tempGrid[row - 1][col - 1].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row - 1, col - 1], [-1, -1]) }
      if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && !tempGrid[row + 1][col - 1].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row + 1, col - 1], [1, -1]) }
    }
    //not offset
    if (((row % 2) !== 0 && !this.state.isOddRowOffset) || ((row % 2) == 0 && this.state.isOddRowOffset)) {
      if (row > 0 && !tempGrid[row - 1][col].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row - 1, col], [-1, -1]) }
      if (row < (tempGrid.length - 1) && !tempGrid[row + 1][col].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row + 1, col], [1, -1]) }
      if (col < (tempGrid[row].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && !tempGrid[row - 1][col + 1].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row - 1, col + 1], [-1, 1]) }
      if (col < (tempGrid[row].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && !tempGrid[row + 1][col + 1].isBufferHex) { tempGrid = this.grasshopJump(tempGrid, [row + 1, col + 1], [1, 1]) }
    }
    return tempGrid

  }
  grasshopJump(grid, coord, direction, callNb) {
    console.log(coord)
    console.log(direction)
    console.log('jump!')
    var row = coord[0] + direction[0] // row updates everytime
    var col = coord[1]
    var tempGrid = grid
    //if row is stable, col updates everytime
    if (direction[0] === 0) { col += direction[1] }
    if (direction[0] !== 0) {
      //if its an offset row(odd row and odd offset OR  even row and not odd offset)
      //not offset
      if (((row % 2) === 0 && this.state.isOddRowOffset) || ((row % 2) !== 0 && !this.state.isOddRowOffset)) {
        if (direction[1] < 0) {
          col += direction[1]
        }
      }
      //offset
      if (((row % 2) != 0 && this.state.isOddRowOffset) || ((row % 2) === 0 && !this.state.isOddRowOffset)) {
        if (direction[1] > 0) {
          col += direction[1]
        }
      }
    }
    if (tempGrid[row][col].isBufferHex) {
      tempGrid[row][col].isAvailable = true
      return tempGrid
    }
    tempGrid = this.grasshopJump(tempGrid, [row, col], direction)
    return tempGrid
  }
  availableBeetle = (grid, coord) => {
    var tempGrid = grid
    const row = coord[0]
    const col = coord[1]

    if (col > 0) { tempGrid[row][col - 1].isAvailable = true }
    if (col < (tempGrid[row].length - 1)) { tempGrid[row][col + 1].isAvailable = true }
    if (row > 0) { tempGrid[row - 1][col].isAvailable = true }
    if (row < (tempGrid.length - 1)) { tempGrid[row + 1][col].isAvailable = true }

    if (((row % 2) == 0 && !this.state.isOddRowOffset) || ((row % 2) != 0 && this.state.isOddRowOffset)) {
      if (col > 0 && row > 0 && tempGrid[row - 1][col - 1]) { tempGrid[row - 1][col - 1].isAvailable = true }
      if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1]) { tempGrid[row + 1][col - 1].isAvailable = true }
    }
    if (((row % 2) == 1 && !this.state.isOddRowOffset) || ((row % 2) == 0 && this.state.isOddRowOffset)) {
      if (col < (tempGrid[row].length - 1) && row > 0 && tempGrid[row - 1][col + 1]) { tempGrid[row - 1][col + 1].isAvailable = true }
      if (col < (tempGrid[row].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1]) { tempGrid[row + 1][col + 1].isAvailable = true }
    }
    return tempGrid
  }
  availableAnt = (grid, coord) => {
    var tempGrid = grid
    const row = coord[0]
    const col = coord[1]
    //recursive ending
    if (tempGrid[row][col].isAvailable) { return tempGrid }
    tempGrid[row][col].isAvailable = true

    if (col > 0 && tempGrid[row][col - 1] && tempGrid[row][col - 1].isBufferHex) {
      tempGrid = this.availableAnt(tempGrid, [row, col - 1])
    }
    if (col < (tempGrid[0].length - 1) && tempGrid[row][col + 1] && tempGrid[row][col + 1].isBufferHex) {
      tempGrid = this.availableAnt(tempGrid, [row, col + 1])
    }
    if (row > 0 && tempGrid[row - 1][col] && tempGrid[row - 1][col].isBufferHex) {
      tempGrid = this.availableAnt(tempGrid, [row - 1, col])
    }
    if (row < (tempGrid.length - 1) && tempGrid[row + 1][col] && tempGrid[row + 1][col].isBufferHex) {
      tempGrid = this.availableAnt(tempGrid, [row + 1, col])
    }

    if (((row % 2) == 0 && !this.state.isOddRowOffset) || ((row % 2) != 0 && this.state.isOddRowOffset)) {
      if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && tempGrid[row - 1][col - 1].isBufferHex) {
        tempGrid = this.availableAnt(tempGrid, [row - 1, col - 1])
      }
      if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && tempGrid[row + 1][col - 1].isBufferHex) {
        tempGrid = this.availableAnt(tempGrid, [row + 1, col - 1])
      }
    }
    if (((row % 2) == 1 && !this.state.isOddRowOffset) || ((row % 2) == 0 && this.state.isOddRowOffset)) {
      if (col < (tempGrid[0].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && tempGrid[row - 1][col + 1].isBufferHex) {
        tempGrid = this.availableAnt(tempGrid, [row - 1, col + 1])
      }
      if (col < (tempGrid[0].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && tempGrid[row + 1][col + 1].isBufferHex) {
        tempGrid = this.availableAnt(tempGrid, [row + 1, col + 1])
      }
    }
    return tempGrid
  }

  //works for now but still WIP -> need team recon
  availableForPlacing = (grid, coord, currentPlayer) => {
    //need to check its only touching its teammates
    var tempGrid = grid
    for (var i = 0; i < tempGrid.length; i++) {
      for (var j = 0; j < tempGrid[0].length; j++) {
        if (tempGrid[i][j] && tempGrid[i][j].isBufferHex) {
          tempGrid[i][j].isAvailable = true
        }
      }
    }
    return tempGrid
  }

  //wip
  showAvailableNodes = (coord, location) => {

    var tempGrid = this.state.gameGrid

    if (location === 'hand') {
      //Show avalability of new hex for players [currentplayer]
      //  any bufferHex touching only current player's  hexs
      tempGrid = this.availableForPlacing(tempGrid, coord, this.state.currentPlayer)

    }
    if (location === 'hive') {
      var bug = tempGrid[coord[0]][coord[1]].content[0]

      //console.log(bug)

      if (bug.name === 'Queen') {
        console.log('queen procedure')
        tempGrid = this.availableQueen(tempGrid, coord)
      }
      if (bug.name === 'Spider') {
        console.log('spider procedure')
        const count = 3
        const usedCoord = []
        tempGrid = this.availableSpider(tempGrid, coord, count, usedCoord)
      }
      if (bug.name === 'Beetle') {
        console.log('beetle procedure')
        tempGrid = this.availableBeetle(tempGrid, coord)
      }
      //WIP
      if (bug.name === 'Grasshop') {
        console.log('Grasshop procedure')
        tempGrid = this.availableGrasshop(tempGrid, coord)
      }
      if (bug.name === 'Ant') {
        console.log('ant procedure')
        tempGrid = this.availableAnt(tempGrid, coord)
      }


    }
    return tempGrid

  }
  //Remove the Available status on all the nodes of the hive
  hideAvailableNodes = () => {

    var tempGrid = this.state.gameGrid
    for (var i = 0; i < tempGrid.length; i++) {
      for (var j = 0; j < tempGrid[0].length; j++) {
        if (tempGrid[i][j]) {
          tempGrid[i][j].isAvailable = false
        }
      }
    }
    this.setState({ gameGrid: tempGrid })

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
      this.hideAvailableNodes()

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


    }
  }
  setSelectedNode = (coord, isInHand) => {
    this.resetSelectedNode()
    var tempSelectedNode = this.state.selectedNode
    var tempGrid = this.state.gameGrid
    //console.log("isInHand: " + isInHand)
    tempGrid = this.showAvailableNodes(coord, isInHand)

    isInHand = (isInHand === 'hand' ? true : false)

    //remove the oldNode



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
      this.setState({ gameGrid: tempGrid, selectedNode: tempSelectedNode })
    })
    //console.log("Select Selected Node:")
    //console.log(this.state.selectedNode)

  }
  //handle the clicking of an hex whether in hand or in board
  hexClick = (coord, location) => {

    if (location === 'hive') {
      //If there was no selected node, select the clicked node
      if (!this.state.selectedNode.isSelect) {
        if (!this.state.gameGrid[coord[0]][coord[1]].isBufferHex) {
          this.setSelectedNode(coord, 'hive')
        }
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

          //Clicking a second time on a node de-select it
          if (coord[0] === this.state.selectedNode.coord[0] && coord[1] === this.state.selectedNode.coord[1]) {

            this.resetSelectedNode()
            return
          }

          //if the clicked node a valid move for the selected ndoe
          if (this.state.gameGrid[coord[0]][coord[1]].isAvailable) {
            //move selected node at clicked node location
            this.move_bug(this.state.selectedNode.coord, coord, this.state.currentPlayer)
            return
          }
          //If its not a valid move
          if (!this.state.gameGrid[coord[0]][coord[1]].isAvailable) {
            if (coord === this.state.selectedNode.coord) { this.resetSelectedNode() }
            //clicked node is now selected node
            this.setSelectedNode(coord, 'hive')
            return
          }
        }
      }
    }
    if (location === 'hand') {
      this.setSelectedNode(coord, 'hand')
      return
    }
  }
  gridMaintenance = (grid, lastPlayedNode) => {

    var { tempGrid, tempIsOddRowOffset } = this.expandGrid(grid, lastPlayedNode)
    tempGrid = this.removeUnconnectedNodes(tempGrid, tempIsOddRowOffset)
    tempGrid = this.keepGridSmall(tempGrid)
    return tempGrid
  }
  //Add all the hex that border the hex we just put on the coord passed in porp
  expandGrid = (tempGrid, coord) => {
    var tempIsOddRowOffset = this.state.isOddRowOffset
    var row = coord[0]
    var col = coord[1]
    //activate the clicked node
    tempGrid[row][col].isBufferHex = false

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
      tempIsOddRowOffset = !tempIsOddRowOffset
      //Could probs re-code to not have to use flushsync here ---
      flushSync(() => {
        this.setState({ isOddRowOffset: tempIsOddRowOffset })
      })
      console.log("switch offset")
      row += 1
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
    return { tempGrid, tempIsOddRowOffset }
  }
  removeUnconnectedNodes = (tempGrid, tempIsOddRowOffset) => {

    for (var i = 0; i < tempGrid.length; i++) {
      for (var j = 0; j < tempGrid[0].length; j++) {
        //if its an empty node, make sure its connected to a node with content, if not delete node
        if (tempGrid[i][j] && tempGrid[i][j].isBufferHex) {
          var isConnectedToBug = false
          //check the same row
          if (j > 0 && tempGrid[i][j - 1] && !tempGrid[i][j - 1].isBufferHex) { isConnectedToBug = true }
          if (j < (tempGrid[0].length - 1) && tempGrid[i][j + 1] && !tempGrid[i][j + 1].isBufferHex) { isConnectedToBug = true }
          //check top and bot row
          if (((i % 2) !== 0 && tempIsOddRowOffset) || ((i % 2) === 0 && !tempIsOddRowOffset)) {
            if (i > 0) {
              if (tempGrid[i - 1][j] && !tempGrid[i - 1][j].isBufferHex) { isConnectedToBug = true }
              if (j > 0 && tempGrid[i - 1][j - 1] && !tempGrid[i - 1][j - 1].isBufferHex) { isConnectedToBug = true }
            }
            if (i < (tempGrid.length - 1)) {
              if (tempGrid[i + 1][j] && !tempGrid[i + 1][j].isBufferHex) { isConnectedToBug = true }
              if (j > 0 && tempGrid[i + 1][j - 1] && !tempGrid[i + 1][j - 1].isBufferHex) { isConnectedToBug = true }
            }
          }
          if (((i % 2) !== 0 && !tempIsOddRowOffset) || ((i % 2) === 0 && tempIsOddRowOffset)) {
            if (i > 0) {
              if (tempGrid[i - 1][j] && !tempGrid[i - 1][j].isBufferHex) { isConnectedToBug = true }
              if (j < (tempGrid[0].length - 1) && tempGrid[i - 1][j + 1] && !tempGrid[i - 1][j + 1].isBufferHex) { isConnectedToBug = true }
            }
            if (i < (tempGrid.length - 1)) {
              if (tempGrid[i + 1][j] && !tempGrid[i + 1][j].isBufferHex) { isConnectedToBug = true }
              if (j < (tempGrid[0].length - 1) && tempGrid[i + 1][j + 1] && !tempGrid[i + 1][j + 1].isBufferHex) { isConnectedToBug = true }
            }
          }
          if (!isConnectedToBug) { tempGrid[i][j] = '' }
        }
      }
    }
    return tempGrid
  }
  keepGridSmall = (grid) => {

    var tempGrid = grid
    //check for empty borders
    //Check if top row empty,if empty remove first row
    var isEmpty = true
    for (var i = 0; i < tempGrid[0].length; i++) { if (tempGrid[0][i]) { isEmpty = false } }
    if (isEmpty) {
      flushSync(() => {
        this.setState({ isOddRowOffset: !this.state.isOddRowOffset })
      })

      tempGrid.shift()
    }
    isEmpty = true
    //check if left col empty, if empty, remove first elem of each row
    for (var i = 0; i < tempGrid.length; i++) { if (tempGrid[i][0]) { isEmpty = false } }
    if (isEmpty) {
      for (var i = 0; i < tempGrid.length; i++) { tempGrid[i].shift() }
    }
    isEmpty = true
    //check if bot row empty, if empty remove last row
    for (var i = 0; i < tempGrid[0].length; i++) { if (tempGrid[tempGrid.length - 1][i]) { isEmpty = false } }
    if (isEmpty) { tempGrid.pop() }
    isEmpty = true
    //check if right col empty,if empty remove the last elem of each row
    for (var i = 0; i < tempGrid.length; i++) { if (tempGrid[i][tempGrid[0].length - 1]) { isEmpty = false } }
    if (isEmpty) {
      for (var i = 0; i < tempGrid.length; i++) { tempGrid[i].pop() }
    }
    //console.log("minize tests done")

    return tempGrid


  }
  //Move a bug already in play
  move_bug = (startNodeCoord, endNodeCoord, currentPlayer) => {

    this.resetSelectedNode()


    var tempGrid = this.state.gameGrid

    tempGrid[endNodeCoord[0]][endNodeCoord[1]].content.unshift(tempGrid[startNodeCoord[0]][startNodeCoord[1]].content.shift())

    if (!tempGrid[startNodeCoord[0]][startNodeCoord[1]].content[0]) {
      tempGrid[startNodeCoord[0]][startNodeCoord[1]].isBufferHex = true
      //try to remove this flush sync if possible
    }

    tempGrid = this.gridMaintenance(tempGrid, endNodeCoord)



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
      tempGrid = this.gridMaintenance(tempGrid, endNodeCoord)
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