//takes a grid( and if the grid isOddRowOffset), the coord/location/player of the selected node, and the total nb of bugs

import { update } from 'lodash';

//return a grid with all the available node for the selected node set to true
const _ = require('lodash');


const showAvailableNodes = (tempGrid, coord, location, player, isOddRowOffset, bugCounter) => {

    if (location === 'hand') {
        //Show avalability of new hex for players [currentplayer]
        //  any bufferHex touching only current player's hexs
        tempGrid = availableForPlacing(tempGrid, player, isOddRowOffset)

    }
    if (location === 'hive') {
        var bug = tempGrid[coord[0]][coord[1]].content[0]

        //console.log(bug)

        if (bug.name === 'Queen') {

            console.log('queen procedure')
            tempGrid = availableQueen(tempGrid, coord, isOddRowOffset, bugCounter)
        }
        if (bug.name === 'Spider') {
            console.log('spider procedure')
            const count = 3
            const usedCoord = []
            const startCoord = coord
            console.log('startcoord for spider:' + startCoord)
            tempGrid = availableSpider(tempGrid, coord, count, usedCoord, isOddRowOffset, bugCounter, startCoord)
        }
        if (bug.name === 'Beetle') {
            console.log('beetle procedure')
            tempGrid = availableBeetle(tempGrid, coord, isOddRowOffset, bugCounter)
        }
        if (bug.name === 'Grasshop') {

            console.log('Grasshop procedure')
            tempGrid = availableGrasshop(tempGrid, coord, isOddRowOffset, bugCounter)
        }
        if (bug.name === 'Ant') {

            console.log('ant procedure')
            const usedCoord = []
            const startNodeCoord = coord


            tempGrid = availableAnt(tempGrid, coord, usedCoord, startNodeCoord, isOddRowOffset, bugCounter)
        }
    }
    return tempGrid

}

const availableQueen = (grid, coord, isOddRowOffset, bugCounter) => {
    // anybufferHex touching the queen

    var tempGrid = grid
    const row = coord[0]
    const col = coord[1]

    if (col > 0 && tempGrid[row][col - 1].isBufferHex) { tempGrid[row][col - 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row, col - 1], isOddRowOffset, bugCounter) }
    if (col < (tempGrid[row].length - 1) && tempGrid[row][col + 1].isBufferHex) { tempGrid[row][col + 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row, col + 1], isOddRowOffset, bugCounter) }
    if (row > 0 && tempGrid[row - 1][col].isBufferHex) { tempGrid[row - 1][col].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row - 1, col], isOddRowOffset, bugCounter) }
    if (row < (tempGrid.length - 1) && tempGrid[row + 1][col].isBufferHex) { tempGrid[row + 1][col].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row + 1, col], isOddRowOffset, bugCounter) }

    if (((row % 2) === 0 && !isOddRowOffset) || ((row % 2) !== 0 && isOddRowOffset)) {
        if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && tempGrid[row - 1][col - 1].isBufferHex) { tempGrid[row - 1][col - 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row - 1, col - 1], isOddRowOffset, bugCounter) }
        if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && tempGrid[row + 1][col - 1].isBufferHex) { tempGrid[row + 1][col - 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row + 1, col - 1], isOddRowOffset, bugCounter) }
    }
    if (((row % 2) === 1 && !isOddRowOffset) || ((row % 2) === 0 && isOddRowOffset)) {
        if (col < (tempGrid[row].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && tempGrid[row - 1][col + 1].isBufferHex) { tempGrid[row - 1][col + 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row - 1, col + 1], isOddRowOffset, bugCounter) }
        if (col < (tempGrid[row].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && tempGrid[row + 1][col + 1].isBufferHex) { tempGrid[row + 1][col + 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row + 1, col + 1], isOddRowOffset, bugCounter) }
    }
    console.log('alive')
    return tempGrid
}
const availableSpider = (grid, coord, count, usedCoord, isOddRowOffset, bugCounter, startCoord) => {
    //exactly 3 hex from the spider, cant go up bug
    //toggle avalability when counter hits zero
    var tempGrid = grid

    const row = coord[0]
    const col = coord[1]
    //recursive ending
    if (count === 0) {
        console.log('starting from pts ' + startCoord)
        tempGrid[row][col].isAvailable = true
        //tempGrid[row][col].isAvailable = hiveIntegrityCheck(tempGrid, startCoord, coord, isOddRowOffset, bugCounter)
        return tempGrid
    }
    count -= 1

    usedCoord += coord

    if (col > 0 && tempGrid[row][col - 1] && tempGrid[row][col - 1].isBufferHex) {
        if (!usedCoord.includes([row, col - 1]) && hiveIntegrityCheck(tempGrid, startCoord, [row, col - 1], isOddRowOffset, bugCounter)) {
            tempGrid = availableSpider(tempGrid, [row, col - 1], count, usedCoord, isOddRowOffset, bugCounter, startCoord)
            console.log(`hit`)
        }

    }
    if (col < (tempGrid[row].length - 1) && tempGrid[row][col + 1] && tempGrid[row][col + 1].isBufferHex) {
        if (!usedCoord.includes([row, col + 1]) && hiveIntegrityCheck(tempGrid, startCoord, [row, col + 1], isOddRowOffset, bugCounter)) {
            tempGrid = availableSpider(tempGrid, [row, col + 1], count, usedCoord, isOddRowOffset, bugCounter, startCoord)
            console.log(`hit`)
        }
    }
    if (row > 0 && tempGrid[row - 1][col] && tempGrid[row - 1][col].isBufferHex) {
        if (!usedCoord.includes([row - 1, col]) && hiveIntegrityCheck(tempGrid, startCoord, [row - 1, col], isOddRowOffset, bugCounter)) {
            tempGrid = availableSpider(tempGrid, [row - 1, col], count, usedCoord, isOddRowOffset, bugCounter, startCoord)
            console.log(`hit`)
        }
    }
    if (row < (tempGrid.length - 1) && tempGrid[row + 1][col] && tempGrid[row + 1][col].isBufferHex) {
        if (!usedCoord.includes([row + 1, col]) && hiveIntegrityCheck(tempGrid, startCoord, [row + 1, col], isOddRowOffset, bugCounter)) {
            tempGrid = availableSpider(tempGrid, [row + 1, col], count, usedCoord, isOddRowOffset, bugCounter, startCoord)
            console.log(`hit`)
        }
    }

    if (((row % 2) === 0 && !isOddRowOffset) || ((row % 2) !== 0 && isOddRowOffset)) {
        if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && tempGrid[row - 1][col - 1].isBufferHex) {
            if (!usedCoord.includes([row - 1, col - 1]) && hiveIntegrityCheck(tempGrid, startCoord, [row - 1, col - 1], isOddRowOffset, bugCounter)) {
                tempGrid = availableSpider(tempGrid, [row - 1, col - 1], count, usedCoord, isOddRowOffset, bugCounter, startCoord)
                console.log(`hit`)
            }
        }
        if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && tempGrid[row + 1][col - 1].isBufferHex) {
            if (!usedCoord.includes([row + 1, col - 1]) && hiveIntegrityCheck(tempGrid, startCoord, [row + 1, col - 1], isOddRowOffset, bugCounter)) {
                tempGrid = availableSpider(tempGrid, [row + 1, col - 1], count, usedCoord, isOddRowOffset, bugCounter, startCoord)
                console.log(`hit`)
            }
        }
    }
    if (((row % 2) === 1 && !isOddRowOffset) || ((row % 2) === 0 && isOddRowOffset)) {
        if (col < (tempGrid[row].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && tempGrid[row - 1][col + 1].isBufferHex) {
            if (!usedCoord.includes([row - 1, col + 1]) && hiveIntegrityCheck(tempGrid, startCoord, [row - 1, col + 1], isOddRowOffset, bugCounter)) {
                tempGrid = availableSpider(tempGrid, [row - 1, col + 1], count, usedCoord, isOddRowOffset, bugCounter, startCoord)
                console.log(`hit`)
            }
        }
        if (col < (tempGrid[row].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && tempGrid[row + 1][col + 1].isBufferHex) {
            if (!usedCoord.includes([row + 1, col + 1]) && hiveIntegrityCheck(tempGrid, startCoord, [row + 1, col + 1], isOddRowOffset, bugCounter)) {
                tempGrid = availableSpider(tempGrid, [row + 1, col + 1], count, usedCoord, isOddRowOffset, bugCounter, startCoord)
                console.log(`hit`)
            }
        }
    }
    return tempGrid

}
const availableGrasshop = (grid, coord, isOddRowOffset, bugCounter) => {

    var tempGrid = grid
    const row = coord[0]
    const col = coord[1]
    const startCoord = coord
    //console.log(startCoord)

    if (col > 0 && !tempGrid[row][col - 1].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row, col - 1], [0, -1], isOddRowOffset, bugCounter, startCoord) }
    if (col < (tempGrid[row].length - 1) && !tempGrid[row][col + 1].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row, col + 1], [0, 1], isOddRowOffset, bugCounter, startCoord) }

    //offset 
    if (((row % 2) === 0 && !isOddRowOffset) || ((row % 2) !== 0 && isOddRowOffset)) {
        if (row > 0 && !tempGrid[row - 1][col].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row - 1, col], [-1, 1], isOddRowOffset, bugCounter, startCoord) }
        if (row < (tempGrid.length - 1) && !tempGrid[row + 1][col].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row + 1, col], [1, 1], isOddRowOffset, bugCounter, startCoord) }
        if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && !tempGrid[row - 1][col - 1].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row - 1, col - 1], [-1, -1], isOddRowOffset, bugCounter, startCoord) }
        if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && !tempGrid[row + 1][col - 1].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row + 1, col - 1], [1, -1], isOddRowOffset, bugCounter, startCoord) }
    }
    //not offset
    if (((row % 2) !== 0 && !isOddRowOffset) || ((row % 2) === 0 && isOddRowOffset)) {
        if (row > 0 && !tempGrid[row - 1][col].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row - 1, col], [-1, -1], isOddRowOffset, bugCounter, startCoord) }
        if (row < (tempGrid.length - 1) && !tempGrid[row + 1][col].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row + 1, col], [1, -1], isOddRowOffset, bugCounter, startCoord) }
        if (col < (tempGrid[row].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && !tempGrid[row - 1][col + 1].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row - 1, col + 1], [-1, 1], isOddRowOffset, bugCounter, startCoord) }
        if (col < (tempGrid[row].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && !tempGrid[row + 1][col + 1].isBufferHex) { tempGrid = grasshopJump(tempGrid, [row + 1, col + 1], [1, 1], isOddRowOffset, bugCounter, startCoord) }
    }
    return tempGrid

}
const grasshopJump = (grid, coord, direction, isOddRowOffset, bugCounter, startCoord) => {
    var row = coord[0] + direction[0] // row updates everytime
    var col = coord[1]
    var tempGrid = grid
    //console.log(startCoord)
    //if row is stable, col updates everytime
    if (direction[0] === 0) { col = (col === '' ? 1 : col + direction[1]) }
    if (direction[0] !== 0) {
        //if its an offset row(odd row and odd offset OR  even row and not odd offset)
        //not offset
        if (((row % 2) === 0 && isOddRowOffset) || ((row % 2) !== 0 && !isOddRowOffset)) {
            if (direction[1] < 0) {
                col = (col === '' ? 1 : col + direction[1])
            }
        }
        //offset
        if (((row % 2) !== 0 && isOddRowOffset) || ((row % 2) === 0 && !isOddRowOffset)) {
            if (direction[1] > 0) {
                col = (col === '' ? 1 : col + direction[1])
            }
        }
    }

    if (tempGrid[row][col].isBufferHex) {
        console.log("sending startCoord: " + startCoord)
        tempGrid[row][col].isAvailable = hiveIntegrityCheck(tempGrid, startCoord, coord, isOddRowOffset, bugCounter)
        return tempGrid
    }
    if (!tempGrid[row][col]) { return }
    tempGrid = grasshopJump(tempGrid, [row, col], direction, isOddRowOffset, bugCounter, startCoord)
    return tempGrid
}
const availableBeetle = (grid, coord, isOddRowOffset, bugCounter) => {
    var tempGrid = [...grid]

    const row = coord[0]
    const col = coord[1]

    if (col > 0) {
        tempGrid[row][col - 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row, col - 1], isOddRowOffset, bugCounter)
        //tempGrid[row][col - 1].isAvailable = true 
    }
    if (col < (tempGrid[row].length - 1)) {
        tempGrid[row][col + 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row, col + 1], isOddRowOffset, bugCounter)
        // tempGrid[row][col + 1].isAvailable = true
    }
    if (row > 0) {
        tempGrid[row - 1][col].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row - 1, col], isOddRowOffset, bugCounter)
        // tempGrid[row - 1][col].isAvailable = true
    }
    if (row < (tempGrid.length - 1)) {
        tempGrid[row + 1][col].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row + 1, col], isOddRowOffset, bugCounter)
        // tempGrid[row + 1][col].isAvailable = true 
    }

    if (((row % 2) === 0 && !isOddRowOffset) || ((row % 2) !== 0 && isOddRowOffset)) {
        if (col > 0 && row > 0 && tempGrid[row - 1][col - 1]) {
            tempGrid[row - 1][col - 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row - 1, col - 1], isOddRowOffset, bugCounter)
            // tempGrid[row - 1][col - 1].isAvailable = true
        }
        if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1]) {
            tempGrid[row + 1][col - 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row + 1, col - 1], isOddRowOffset, bugCounter)
            //tempGrid[row + 1][col - 1].isAvailable = true
        }
    }
    if (((row % 2) === 1 && !isOddRowOffset) || ((row % 2) === 0 && isOddRowOffset)) {
        if (col < (tempGrid[row].length - 1) && row > 0 && tempGrid[row - 1][col + 1]) {
            tempGrid[row - 1][col + 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row - 1, col + 1], isOddRowOffset, bugCounter)
            //tempGrid[row - 1][col + 1].isAvailable = true
        }
        if (col < (tempGrid[row].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1]) {
            tempGrid[row + 1][col + 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row + 1, col + 1], isOddRowOffset, bugCounter)
            //tempGrid[row + 1][col + 1].isAvailable = true
        }
    }
    return tempGrid
}
const availableAnt = (grid, coord, usedCoord, startNodeCoord, isOddRowOffset, bugCounter) => {
    var tempGrid = grid
    const row = coord[0]
    const col = coord[1]
    //recursive ending
    if (usedCoord.includes(coord)) {

        return tempGrid
    }
    usedCoord += coord

    //console.log(hiveIntegrityCheck(tempGrid, startNodeCoord, coord, isOddRowOffset, bugCounter))

    tempGrid[row][col].isAvailable = hiveIntegrityCheck(tempGrid, startNodeCoord, coord, isOddRowOffset, bugCounter)

    if (col > 0 && tempGrid[row][col - 1] && tempGrid[row][col - 1].isBufferHex) {
        tempGrid = availableAnt(tempGrid, [row, col - 1], usedCoord, startNodeCoord, isOddRowOffset, bugCounter)
    }
    if (col < (tempGrid[0].length - 1) && tempGrid[row][col + 1] && tempGrid[row][col + 1].isBufferHex) {
        tempGrid = availableAnt(tempGrid, [row, col + 1], usedCoord, startNodeCoord, isOddRowOffset, bugCounter)
    }
    if (row > 0 && tempGrid[row - 1][col] && tempGrid[row - 1][col].isBufferHex) {
        tempGrid = availableAnt(tempGrid, [row - 1, col], usedCoord, startNodeCoord, isOddRowOffset, bugCounter)
    }
    if (row < (tempGrid.length - 1) && tempGrid[row + 1][col] && tempGrid[row + 1][col].isBufferHex) {
        tempGrid = availableAnt(tempGrid, [row + 1, col], usedCoord, startNodeCoord, isOddRowOffset, bugCounter)
    }

    if (((row % 2) === 0 && !isOddRowOffset) || ((row % 2) !== 0 && isOddRowOffset)) {
        if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && tempGrid[row - 1][col - 1].isBufferHex) {
            tempGrid = availableAnt(tempGrid, [row - 1, col - 1], usedCoord, startNodeCoord, isOddRowOffset, bugCounter)
        }
        if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && tempGrid[row + 1][col - 1].isBufferHex) {
            tempGrid = availableAnt(tempGrid, [row + 1, col - 1], usedCoord, startNodeCoord, isOddRowOffset, bugCounter)
        }
    }
    if (((row % 2) === 1 && !isOddRowOffset) || ((row % 2) === 0 && isOddRowOffset)) {
        if (col < (tempGrid[0].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && tempGrid[row - 1][col + 1].isBufferHex) {
            tempGrid = availableAnt(tempGrid, [row - 1, col + 1], usedCoord, startNodeCoord, isOddRowOffset, bugCounter)
        }
        if (col < (tempGrid[0].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && tempGrid[row + 1][col + 1].isBufferHex) {
            tempGrid = availableAnt(tempGrid, [row + 1, col + 1], usedCoord, startNodeCoord, isOddRowOffset, bugCounter)
        }
    }

    return tempGrid
}
//works for now but still WIP -> need team recon
const availableForPlacing = (grid, player, isOddRowOffset, bugCounter) => {
    //need to check its only touching its teammates
    var tempGrid = grid
    for (var i = 0; i < tempGrid.length; i++) {
        for (var j = 0; j < tempGrid[0].length; j++) {
            if (tempGrid[i][j] && tempGrid[i][j].isBufferHex) {
                //CHECK IF ALL TOUCHING NODE ARE OWNED BY CURRENTPLAYER
                tempGrid[i][j].isAvailable = true
            }
        }
    }
    return tempGrid
}



/* // under is a recursive buggy wip to the singular hie problem

//tempGrid[row][col - 1].isAvailable = hiveIntegrityCheck(tempGrid, coord, [row, col - 1], isOddRowOffset, bugCounter)
//returns true of false
const hiveIntegrityCheck = (grid, startNodeCoord, endNodeCoord, isOddRowOffset, bugCounter) => {
    //return true
    //clone the grid, no reference here
    var testGrid = _.cloneDeep(grid)

    //hypoteticly switch both node first content
    testGrid[endNodeCoord[0]][endNodeCoord[1]].content.unshift(testGrid[startNodeCoord[0]][startNodeCoord[1]].content.shift())
    testGrid[endNodeCoord[0]][endNodeCoord[1]].isBufferHex = false
    testGrid[startNodeCoord[0]][startNodeCoord[1]].isBufferHex = true


    if (!checkAround(testGrid, endNodeCoord, isOddRowOffset)) { return false }


    //Get the array of coord in string form
    const usedCoords = []
    var connectedNodeArray = countConnectedNodes(testGrid, endNodeCoord[0], endNodeCoord[1], usedCoords, isOddRowOffset)

    //for each elem in connectedNodeArray,
    //  transform the string coord in coord,
    //  add the length of the node of coord to the sum
    //if sum ===activecounter, return true
    //return false
    console.log(connectedNodeArray)
    console.log("i counted:" + connectedNodeArray.length)
    console.log('there was: ' + bugCounter)
    console.log('coord: ' + endNodeCoord + ' is ' + (connectedNodeArray.length === (bugCounter) ? true : false))

    if (connectedNodeArray.length === (bugCounter)) { return true }


}

//return a count of how many bugs are connected to this one
const countConnectedNodes = (tempGrid, row, col, usedCoords, isOddRowOffset) => {


    if (col > 0 && tempGrid[row][col - 1] && !tempGrid[row][col - 1].isBufferHex) {

        if (!usedCoords.includes(row + '-' + (col - 1))) {
            usedCoords.push(row + '-' + (col - 1))
            usedCoords = countConnectedNodes(tempGrid, row, (col - 1), usedCoords, isOddRowOffset)
        }


    }
    if (col < (tempGrid[0].length - 1) && tempGrid[row][col + 1] && !tempGrid[row][col + 1].isBufferHex) {
        if (!usedCoords.includes(row + '-' + (col + 1))) {
            usedCoords.push(row + '-' + (col + 1))
            usedCoords = countConnectedNodes(tempGrid, row, (col + 1), usedCoords, isOddRowOffset)
        }
    }
    if (row > 0 && tempGrid[row - 1][col] && !tempGrid[row - 1][col].isBufferHex) {
        if (!usedCoords.includes((row - 1) + '-' + (col))) {
            usedCoords.push((row - 1) + '-' + (col))
            usedCoords = countConnectedNodes(tempGrid, (row - 1), col, usedCoords, isOddRowOffset)
        }
    }
    if (row < (tempGrid.length - 1) && tempGrid[row + 1][col] && !tempGrid[row + 1][col].isBufferHex) {
        if (!usedCoords.includes((row + 1) + '-' + (col))) {
            usedCoords.push((row + 1) + '-' + (col))
            usedCoords = countConnectedNodes(tempGrid, (row + 1), col, usedCoords, isOddRowOffset)
        }
    }

    if (((row % 2) === 0 && !isOddRowOffset) || ((row % 2) !== 0 && isOddRowOffset)) {
        if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && !tempGrid[row - 1][col - 1].isBufferHex) {
            if (!usedCoords.includes((row - 1) + '-' + (col - 1))) {
                usedCoords.push((row - 1) + '-' + (col - 1))
                usedCoords = countConnectedNodes(tempGrid, (row - 1), (col - 1), usedCoords, isOddRowOffset)
            }
        }
        if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && !tempGrid[row + 1][col - 1].isBufferHex) {
            if (!usedCoords.includes((row + 1) + '-' + (col - 1))) {
                usedCoords.push((row + 1) + '-' + (col - 1))
                usedCoords = countConnectedNodes(tempGrid, (row + 1), (col - 1), usedCoords, isOddRowOffset)
            }
        }
    }
    if (((row % 2) === 1 && !isOddRowOffset) || ((row % 2) === 0 && isOddRowOffset)) {
        if (col < (tempGrid[0].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && !tempGrid[row - 1][col + 1].isBufferHex) {
            if (!usedCoords.includes((row - 1) + '-' + (col + 1))) {
                usedCoords.push((row - 1) + '-' + (col + 1))
                usedCoords = countConnectedNodes(tempGrid, (row - 1), (col + 1), usedCoords, isOddRowOffset)
            }
        }
        if (col < (tempGrid[0].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && !tempGrid[row + 1][col + 1].isBufferHex) {
            if (!usedCoords.includes((row + 1) + '-' + (col + 1))) {
                usedCoords.push((row + 1) + '-' + (col + 1))
                usedCoords = countConnectedNodes(tempGrid, (row + 1), (col + 1), usedCoords, isOddRowOffset)
            }
        }
    }
    console.log(usedCoords)
    return usedCoords
} */

const hiveIntegrityCheck = (grid, startNodeCoord, endNodeCoord, isOddRowOffset) => {
    console.log('checking: ' + endNodeCoord)

    if (!physicalfitCheck(grid, startNodeCoord, endNodeCoord, isOddRowOffset)) { return false }




    var testGrid = _.cloneDeep(grid)
    //switch the place of both nodes passed through props
    testGrid[endNodeCoord[0]][endNodeCoord[1]].content.unshift(testGrid[startNodeCoord[0]][startNodeCoord[1]].content.shift())
    testGrid[endNodeCoord[0]][endNodeCoord[1]].isBufferHex = false
    testGrid[startNodeCoord[0]][startNodeCoord[1]].isBufferHex = true
    //make sure the new grid is in a single part
    var hiveParts = []  //contains all the parts of the hive we are currently tracking 

    for (var i = 0; i < testGrid.length; i++) {    //For every row,
        for (var j = 0; j < testGrid[0].length; j++) {        //for every col,

            if (testGrid[i][j] && !testGrid[i][j].isBufferHex) {            //if there's a node containing bug(s),check if he touches  any part of the hive

                var nbPartAddedTo = []  //array of all the index of the hiveParts we added the current node to
                var addedTo = false     //switch to tell if we added the current node to the last hivePart

                for (var x = 0; x < hiveParts.length; x++) {    //for every part of the hive

                    addedTo = false     //turn the switch off
                    const startParts = hiveParts[x].length

                    for (var y = 0; y < startParts; y++) { //for all the nodes of the current hivePart
                        if (hiveParts[x][y][0] === (i - 1)) { //we check if it is the i above the current i
                            if ((!(i % 2) && isOddRowOffset) || ((i % 2) && !isOddRowOffset)) {


                                if (hiveParts[x][y][1] === (j + 1)) {     /// -1, +1
                                    hiveParts[x].push([i, j])
                                    addedTo = true
                                }
                            }
                            if ((!(i % 2) && !isOddRowOffset) || ((i % 2) && isOddRowOffset)) {
                                if (hiveParts[x][y][1] === (j - 1)) {     //-1, -1
                                    hiveParts[x].push([i, j])
                                    addedTo = true
                                }
                            }
                            if (hiveParts[x][y][1] === j) {               //-1, 0
                                hiveParts[x].push([i, j])
                                addedTo = true
                            }
                        }
                        if (hiveParts[x][y][0] === i) {   //check if it us the same i
                            if ((hiveParts[x][y][1] === (j + 1)) || (hiveParts[x][y][1] === (j - 1))) {   //0, +1  && 0, -1
                                hiveParts[x].push([i, j])
                                addedTo = true
                            }
                        }
                    }
                    if (addedTo) {
                        console.log('add to one more')
                        nbPartAddedTo.push(x)
                    }  //if the swtich is on, we added the node  we checked: save  index
                }
                if (nbPartAddedTo.length === 0) {   //if current node hasnt been added or is the first node, create a new/the first part to place it
                    console.log("creation of part #" + hiveParts.length)
                    hiveParts[hiveParts.length] = []
                    hiveParts[hiveParts.length - 1].push([i, j])
                }
                if (nbPartAddedTo.length > 1) {     //if current node has been added more than once, join all the hivePart connected by the current node
                    for (var z = 1; z < nbPartAddedTo.length; z++) {
                        for (var a = 0; a < hiveParts[nbPartAddedTo[z]].length; a = 0) {
                            console.log('popped one')
                            hiveParts[nbPartAddedTo[0]].push(hiveParts[nbPartAddedTo[z]].pop())
                        }
                    }
                }
            }
        }
    }
    var nbPart = 0
    for (var o = 0; o < hiveParts.length; o++) {
        if (hiveParts[o].length > 0) { nbPart += 1 }
    }
    console.log(hiveParts)
    if (nbPart === 1) {
        console.log('working: ' + endNodeCoord)
        return true
    }
    console.log('failing: ' + endNodeCoord)
    return false
}

//check around a node to see if its touching another bug
const checkAround = (tempGrid, coord, isOddRowOffset) => {
    const row = coord[0]
    const col = coord[1]

    if (col > 0 && tempGrid[row][col - 1] && tempGrid[row][col - 1].content.length > 0) { return true }
    if (col < (tempGrid[row].length - 1) && tempGrid[row][col + 1] && !tempGrid[row][col + 1].content.length === 0) { return true }

    if (row > 0 && tempGrid[row - 1][col] && tempGrid[row - 1][col].content.length > 0) { return true }
    if (row < (tempGrid.length - 1) && tempGrid[row + 1][col] && tempGrid[row + 1][col].content.length > 0) { return true }

    if (((row % 2) && !isOddRowOffset) || (!(row % 2) && isOddRowOffset)) {
        if (col > 0 && row > 0 && tempGrid[row - 1][col - 1] && tempGrid[row - 1][col - 1].content.length > 0) { return true }
        if (col > 0 && row < (tempGrid.length - 1) && tempGrid[row + 1][col - 1] && tempGrid[row + 1][col - 1].content.length > 0) { return true }
    }
    if ((!(row % 2) && !isOddRowOffset) || ((row % 2) && isOddRowOffset)) {
        if (col < (tempGrid[row].length - 1) && row > 0 && tempGrid[row - 1][col + 1] && tempGrid[row - 1][col + 1].content.length > 0) { return true }
        if (col < (tempGrid[row].length - 1) && row < (tempGrid.length - 1) && tempGrid[row + 1][col + 1] && tempGrid[row + 1][col + 1].content.length > 0) { return true }

    }
    return false
}
//check if the movement could be physicaly possible
const physicalfitCheck = (grid, startNodeCoord, endNodeCoord, isOddRowOffset) => {
    var direction = ''
    //get  the direction
    const startRow = startNodeCoord[0]
    const startCol = startNodeCoord[1]
    const endRow = endNodeCoord[0]
    const endCol = endNodeCoord[1]
    //top
    if (startRow === (endRow + 1)) {
        if (((startRow % 2) && isOddRowOffset) || (!(startRow % 2) && !isOddRowOffset)) {
            if (startCol === endCol) { direction = 'northEast' }
            if (startCol === (endCol - 1)) { direction = 'northWest' }
        }
        if (((startRow % 2) && !isOddRowOffset) || (!(startRow % 2) && isOddRowOffset)) {
            if (startCol === endCol) { direction = 'northWest' }
            if (startCol === (endCol + 1)) { direction = 'northEast' }
        }
    }
    //bot
    if (startRow === (endRow - 1)) {
        if (((startRow % 2) && isOddRowOffset) || (!(startRow % 2) && !isOddRowOffset)) {
            if (startCol === endCol) { direction = 'southEast' }
            if (startCol === (endCol - 1)) { direction = 'southWest' }
        }
        if (((startRow % 2) && !isOddRowOffset) || (!(startRow % 2) && isOddRowOffset)) {
            if (startCol === endCol) { direction = 'southWest' }
            if (startCol === (endCol + 1)) { direction = 'southEast' }
        }
    }
    //middle
    if (startRow === endRow) {
        if (startCol === (endCol + 1)) { direction = 'East' }
        if (startCol === (endCol - 1)) { direction = 'West' }
    }

    if (direction === 'northWest') {
        if (((startRow % 2) && isOddRowOffset) || (!(startRow % 2) && !isOddRowOffset)) {
            if ((grid[startRow][startCol - 1] && !grid[startRow][startCol - 1].isBufferHex) && (grid[startRow - 1][startCol] && !grid[startRow - 1][startCol].isBufferHex)) { return false }
            return true
        }
        if (((startRow % 2) && !isOddRowOffset) || (!(startRow % 2) && isOddRowOffset)) {
            if ((grid[startRow][startCol - 1] && !grid[startRow][startCol - 1].isBufferHex) && (grid[startRow - 1][startCol + 1] && !grid[startRow - 1][startCol + 1].isBufferHex)) { return false }
            return true
        }
    }
    if (direction === 'northEast') {
        if (((startRow % 2) && isOddRowOffset) || (!(startRow % 2) && !isOddRowOffset)) {
            if ((grid[startRow][startCol + 1] && !grid[startRow][startCol + 1].isBufferHex) && (grid[startRow - 1][startCol - 1] && !grid[startRow - 1][startCol - 1].isBufferHex)) { return false }
            return true
        }
        if (((startRow % 2) && !isOddRowOffset) || (!(startRow % 2) && isOddRowOffset)) {
            if ((grid[startRow][startCol + 1] && !grid[startRow][startCol + 1].isBufferHex) && (grid[startRow - 1][startCol] && !grid[startRow - 1][startCol].isBufferHex)) { return false }
            return true
        }
    }
    if (direction === 'SouthEast') {
        if (((startRow % 2) && isOddRowOffset) || (!(startRow % 2) && !isOddRowOffset)) {
            if ((grid[startRow][startCol + 1] && !grid[startRow][startCol + 1].isBufferHex) && (grid[startRow + 1][startCol] && !grid[startRow + 1][startCol].isBufferHex)) { return false }
            return true
        }
        if (((startRow % 2) && !isOddRowOffset) || (!(startRow % 2) && isOddRowOffset)) {
            if ((grid[startRow][startCol + 1] && !grid[startRow][startCol + 1].isBufferHex) && (grid[startRow + 1][startCol + 1] && !grid[startRow + 1][startCol + 1].isBufferHex)) { return false }
            return true
        }
    }
    if (direction === 'SouthWest') {
        if (((startRow % 2) && isOddRowOffset) || (!(startRow % 2) && !isOddRowOffset)) {
            if ((grid[startRow][startCol - 1] && !grid[startRow][startCol - 1].isBufferHex) && (grid[startRow + 1][startCol] && !grid[startRow + 1][startCol].isBufferHex)) { return false }
            return true
        }
        if (((startRow % 2) && !isOddRowOffset) || (!(startRow % 2) && isOddRowOffset)) {
            if ((grid[startRow][startCol - 1] && !grid[startRow][startCol - 1].isBufferHex) && (grid[startRow + 1][startCol + 1] && !grid[startRow + 1][startCol + 1].isBufferHex)) { return false }
            return true
        }
    }
    if (direction === 'East') {
        if (((startRow % 2) && isOddRowOffset) || (!(startRow % 2) && !isOddRowOffset)) {
            if ((grid[startRow - 1][startCol] && !grid[startRow - 1][startCol].isBufferHex) && (grid[startRow + 1][startCol] && !grid[startRow + 1][startCol].isBufferHex)) { return false }
            return true
        }
        if (((startRow % 2) && !isOddRowOffset) || (!(startRow % 2) && isOddRowOffset)) {
            if ((grid[startRow - 1][startCol + 1] && !grid[startRow - 1][startCol + 1].isBufferHex) && (grid[startRow + 1][startCol + 1] && !grid[startRow + 1][startCol + 1].isBufferHex)) { return false }
            return true
        }
    }
    if (direction === 'West') {
        if (((startRow % 2) && isOddRowOffset) || (!(startRow % 2) && !isOddRowOffset)) {
            if ((grid[startRow - 1][startCol - 1] && !grid[startRow - 1][startCol - 1].isBufferHex) && (grid[startRow + 1][startCol - 1] && !grid[startRow + 1][startCol - 1].isBufferHex)) { return false }
            return true
        }
        if (((startRow % 2) && !isOddRowOffset) || (!(startRow % 2) && isOddRowOffset)) {
            if ((grid[startRow - 1][startCol] && !grid[startRow - 1][startCol].isBufferHex) && (grid[startRow + 1][startCol] && !grid[startRow + 1][startCol].isBufferHex)) { return false }
            return true
        }
    }

}


export { showAvailableNodes }