import React from 'react'

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
        "bugName": '',
        "coord": []
      },
      isOddRowOffset: false


    }
  }
  //spawns the first hex
  gameStart = () => {
    var tempGrid = this.state.gameGrid
    tempGrid = [[new Node()]]
    this.setState({ gameGrid: tempGrid })
    //console.log(this.state.gameGrid)
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
    tempGrid[coord[0]][coord[1]].isAvailable = true
    this.setState({ gameGrid: tempGrid })


    //If the first col is clicked, add col at the start of row arrays
    if (col === 0) {
      //For all the rows move add one col at the start
      for (var i = 0; i < tempGrid.length; i++) {
        tempGrid[i].unshift("")
      }
      //the clicked Hex is now situated 1 col further
      col += 1

    }
    //if the first row is clicked, add a new empty row as the starting row
    if (row === 0) {
      const newRow = new Array(tempGrid[0].length)
      tempGrid.unshift(newRow)
      //the clicked Hex is now situated 1 row down
      row += 1
      //rowAdded = true
      tempIsOddRowOffset = !tempIsOddRowOffset


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

    this.setState({ gameGrid: tempGrid })
    this.setState({ isOddRowOffset: tempIsOddRowOffset })



  }
  //Move a bug already in play
  move_bug(startNode, endNode, player) { }
  //Place a bug from the player's hand
  place_bug(endNode, player) { }
  //check passedGamegrid for complete and singular connection of the the bugs
  verifyConnection(possibleGameGrid) { }
  //Show all possible distinations
  showPossibleNodes() {

  }


  render() {
    return (
      <>
        <Title />
        <div className='Game'>

          <Hive gameGrid={this.state.gameGrid} isOddRowOffset={this.state.isOddRowOffset} hexClick={this.expandGrid} />


          <div className='playerContainer'>
            <PlayerCard player={this.state.players[0]} rules={this.state.rules} hexClick={this.selectFromHand} />
            <PlayerCard player={this.state.players[1]} rules={this.state.rules} hexClick={this.selectFromHand} />
          </div>

        </div>


      </>)
  }

}

export default Game

//this.expandGrid([0, 0])