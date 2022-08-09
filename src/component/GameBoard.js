import React, { useEffect, useState } from 'react'


//Component
import Title from './Title'
import Hive from './Hive'
import PlayerCard from './PlayerCard'

//Classes
import Node from '../classes/Node'
//import Bug from '../classes/Bug'
import Player from '../classes/Player'
import { gridMaintenance } from '../utils/gridMaintenance'
import { hideAvailableNodes } from '../utils/hideAvailable'
import { showAvailableNodes } from '../utils/showAvailable'

const _ = require('lodash');

const GameBoard = () => {
    const [gameGrid, setGameGrid] = useState([[new Node()]])
    const [isOddRowOffset, setIsOddRowOffset] = useState(true)
    const [players, setPlayers] = useState([new Player("Player1", "white", true), new Player("Player2", "Black", false)])
    const [bugCounter, setBugCounter] = useState(0)



    const [selectedNode, setSelectedNode] = useState({
        "isSelect": false,
        "isInHand": false,
        "coord": ['', '']
    })
    const [currentPlayer, setCurrentPlayer] = useState(0)

    useEffect(() => {
        resetSelectedNode()
    }, [currentPlayer])


    //remove the selected status to the currently selected node( doesnt affect currentplayer)
    const resetSelectedNode = () => {
        //var tempGrid = _.cloneDeep(gameGrid)
        var tempGrid = [...gameGrid]
        var tempPlayers = [...players]

        if (selectedNode.isSelect) {
            if (selectedNode.isInHand) {
                if (tempPlayers[currentPlayer].hand[selectedNode.coord[1]]) {
                    tempPlayers[currentPlayer].hand[selectedNode.coord[1]].isSelected = false
                }
            }
            if (!selectedNode.isInHand) {
                tempGrid[selectedNode.coord[0]][selectedNode.coord[1]].isSelected = false
            }

            //remove the available status on all the node of the hive
            tempGrid = hideAvailableNodes(tempGrid)

            //Flush sync makes sure the selectedNode state gets reset before any other code goes through

            setGameGrid(tempGrid)
            setSelectedNode({
                "isSelect": false,
                "isInHand": false,
                "coord": ['', '']
            })
            setPlayers(tempPlayers)


        }
    }
    const SelectedNodeSetter = (coord, isInHand) => {
        //console.log("setting coord " + coord)

        resetSelectedNode()



        var tempSelectedNode = { ...selectedNode }
        var tempGrid = [...gameGrid]

        var tempOffset = (isOddRowOffset ? true : false)
        var tempCurrentPlayer = (currentPlayer === 0 ? 0 : 1)

        tempGrid = showAvailableNodes(tempGrid, coord, isInHand, tempCurrentPlayer, tempOffset, bugCounter)

        //Take note of the new SelectedNode
        tempSelectedNode.isSelect = true
        tempSelectedNode.coord = coord
        tempSelectedNode.isInHand = (isInHand === 'hand' ? true : false)

        //Select the new Node ingame
        if (!tempSelectedNode.isInHand) {
            tempGrid[coord[0]][coord[1]].isSelected = true
        }
        if (tempSelectedNode.isInHand) {
            var tempPlayers = [...players]
            tempPlayers[currentPlayer].hand[coord[1]].isSelected = true
            setPlayers(tempPlayers)
        }


        setSelectedNode(tempSelectedNode)
        setGameGrid(tempGrid)


    }
    const place = (nodeCoordFromHand, endNodeCoord) => {

        var tempGrid = [...gameGrid]
        var tempPlayers = [...players]
        //var tempGrid = _.cloneDeep(gameGrid)
        //var tempPlayers = _.cloneDeep(players)

        if (selectedNode.isInHand) {
            if (tempPlayers[currentPlayer].hand[selectedNode.coord[1]]) {
                tempPlayers[currentPlayer].hand[selectedNode.coord[1]].isSelected = false
            }

        }
        if (!selectedNode.isInHand) {
            tempGrid[selectedNode.coord[0]][selectedNode.coord[1]].isSelected = false
        }


        var player = tempPlayers[currentPlayer]
        //If theres stil a bug left in the selected node, remove it and place it in the enbdNodeCoord
        if (player.hand[nodeCoordFromHand[1]].content[0]) {

            tempGrid[endNodeCoord[0]][endNodeCoord[1]].content.unshift(player.hand[nodeCoordFromHand[1]].content.shift())

            var tempOffset = (isOddRowOffset ? true : false)
            var { grid, tempIsOddRowOffset } = gridMaintenance(_.cloneDeep(tempGrid), _.cloneDeep(endNodeCoord), _.cloneDeep(tempOffset))
            tempPlayers[currentPlayer] = player

            setGameGrid(grid)
            setIsOddRowOffset(tempIsOddRowOffset)
            setPlayers(tempPlayers)
            setBugCounter(bugCounter + 1)
            setCurrentPlayer((currentPlayer === 1 ? 0 : 1))
        }
        return
    }
    const move = (startNodeCoord, endNodeCoord) => {

        var tempGrid = _.cloneDeep(gameGrid)
        //var tempGrid = [...gameGrid]

        //remove the selected status to the node
        tempGrid[startNodeCoord[0]][startNodeCoord[1]].isSelected = false


        tempGrid[endNodeCoord[0]][endNodeCoord[1]].content.unshift(tempGrid[startNodeCoord[0]][startNodeCoord[1]].content.shift())

        if (!tempGrid[startNodeCoord[0]][startNodeCoord[1]].content[0]) {
            tempGrid[startNodeCoord[0]][startNodeCoord[1]].isBufferHex = true
        }


        var { grid, tempIsOddRowOffset } = gridMaintenance(_.cloneDeep(tempGrid), _.cloneDeep(endNodeCoord), _.cloneDeep(isOddRowOffset))

        //cleanup


        setGameGrid(grid)
        setIsOddRowOffset(tempIsOddRowOffset)
        setCurrentPlayer((currentPlayer === 1 ? 0 : 1))

    }
    const hexClick = (coord, location) => {

        if (location === 'hive') {

            //If there was no selected node, select the clicked node
            if (!selectedNode.isSelect) {
                if (!gameGrid[coord[0]][coord[1]].isBufferHex) {
                    SelectedNodeSetter(coord, 'hive')
                }
                return
            }
            //if theres already a selected node,
            if (selectedNode.isSelect) {
                //if the selected node is in the player hand
                if (selectedNode.isInHand) {

                    //if the clicked node is a valid move for the selected node
                    if (gameGrid[coord[0]][coord[1]].isAvailable) {

                        place(_.cloneDeep(selectedNode.coord), coord)
                        return
                    }
                    if (!(gameGrid[coord[0]][coord[1]].isAvailable)) {
                        resetSelectedNode()
                        return
                    }
                }
                if (!selectedNode.isInHand) {
                    //Clicking a second time on a node de-select it
                    if (coord[0] === selectedNode.coord[0] && coord[1] === selectedNode.coord[1]) {
                        resetSelectedNode()
                        return
                    }

                    //if the clicked node a valid move for the selected ndoe
                    if (gameGrid[coord[0]][coord[1]].isAvailable) {
                        //move selected node at clicked node location
                        move(_.cloneDeep(selectedNode.coord), coord)
                        return
                    }
                    //If its not a valid move
                    if (!gameGrid[coord[0]][coord[1]].isAvailable) {
                        resetSelectedNode()
                        return
                    }
                }
            }
        }
        if (location === 'hand') {
            //second click on the same node un-select it
            if (coord[1] === selectedNode.coord[1]) {
                resetSelectedNode()
                return
            }
            SelectedNodeSetter(coord, 'hand')

            return
        }
    }

    return (
        <>
            <Title />
            <div className='Game'>
                <Hive gameGrid={gameGrid} isOddRowOffset={isOddRowOffset} hexClick={hexClick} />

                <div className='playerContainer'>
                    <PlayerCard player={players[0]} hexClick={hexClick} />
                    <PlayerCard player={players[1]} hexClick={hexClick} />
                </div>

            </div>



        </>)
}

export default GameBoard