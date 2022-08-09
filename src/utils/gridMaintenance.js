

import Node from '../classes/Node'

//grid maintenance
//Takes a grid, the last played node and if the gris isOddRowOffset
//return a grid of just the right size, without any activated node not touching a bug

const gridMaintenance = (grid, lastPlayedNode, propsisOddRowOffset) => {

    var isOddRowOffset = (propsisOddRowOffset ? true : false)

    ////////Expand the Grid 
    var row = lastPlayedNode[0]
    var col = lastPlayedNode[1]
    //activate the clicked node
    grid[row][col].isBufferHex = false

    //Expand the Grid around the clicked node

    //If the first col is clicked, add col at the start of row arrays
    if (col === 0) {
        //For all the rows move add one col at the start
        for (var i = 0; i < grid.length; i++) {
            grid[i].unshift("")
        }
        //the clicked Hex is now situated 1 col further
        col = (col === '' ? 1 : col + 1)
    }
    //if the first row is clicked, add a new empty row as the starting row
    if (row === 0) {
        const newRow = new Array(grid[0].length)
        grid.unshift(newRow)
        //the clicked Hex is now situated 1 row down
        isOddRowOffset = !isOddRowOffset
        row += 1

    }
    if (col === (grid[0].length - 1)) {
        for (i = 0; i < grid.length; i++) {
            grid[i].push('')
        }
    }
    if (row === (grid.length - 1)) {
        grid.push(new Array(grid[0].length))
    }

    //Add nodes around clicked node
    if ((((row % 2) !== 0) && !isOddRowOffset) || (((row % 2) === 0) && isOddRowOffset)) {
        if (!grid[row - 1][col]) { grid[row - 1][col] = new Node() }
        if (!grid[row - 1][col + 1]) { grid[row - 1][col + 1] = new Node() }

        if (!grid[row][col - 1]) { grid[row][col - 1] = new Node() }
        if (!grid[row][col + 1]) { grid[row][col + 1] = new Node() }

        if (!grid[row + 1][col]) { grid[row + 1][col] = new Node() }
        if (!grid[row + 1][col + 1]) { grid[row + 1][col + 1] = new Node() }
    }
    if ((((row % 2) === 0) && !isOddRowOffset) || (((row % 2) !== 0) && isOddRowOffset)) {
        if (!grid[row - 1][col - 1]) { grid[row - 1][col - 1] = new Node() }
        if (!grid[row - 1][col]) { grid[row - 1][col] = new Node() }

        if (!grid[row][col - 1]) { grid[row][col - 1] = new Node() }
        if (!grid[row][col + 1]) { grid[row][col + 1] = new Node() }

        if (!grid[row + 1][col - 1]) { grid[row + 1][col - 1] = new Node() }
        if (!grid[row + 1][col]) { grid[row + 1][col] = new Node() }
    }

    //Remove all the nodes that arnt connected to a bug

    for (i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            //if its an empty node, make sure its connected to a node with content, if not delete node
            if (grid[i][j] && grid[i][j].isBufferHex) {
                var isConnectedToBug = false
                //check the same row
                if (j > 0 && grid[i][j - 1] && !grid[i][j - 1].isBufferHex) { isConnectedToBug = true }
                if (j < (grid[0].length - 1) && grid[i][j + 1] && !grid[i][j + 1].isBufferHex) { isConnectedToBug = true }
                //check top and bot row
                if (((i % 2) !== 0 && isOddRowOffset) || ((i % 2) === 0 && !isOddRowOffset)) {
                    if (i > 0) {
                        if (grid[i - 1][j] && !grid[i - 1][j].isBufferHex) { isConnectedToBug = true }
                        if (j > 0 && grid[i - 1][j - 1] && !grid[i - 1][j - 1].isBufferHex) { isConnectedToBug = true }
                    }
                    if (i < (grid.length - 1)) {
                        if (grid[i + 1][j] && !grid[i + 1][j].isBufferHex) { isConnectedToBug = true }
                        if (j > 0 && grid[i + 1][j - 1] && !grid[i + 1][j - 1].isBufferHex) { isConnectedToBug = true }
                    }
                }
                if (((i % 2) !== 0 && !isOddRowOffset) || ((i % 2) === 0 && isOddRowOffset)) {
                    if (i > 0) {
                        if (grid[i - 1][j] && !grid[i - 1][j].isBufferHex) { isConnectedToBug = true }
                        if (j < (grid[0].length - 1) && grid[i - 1][j + 1] && !grid[i - 1][j + 1].isBufferHex) { isConnectedToBug = true }
                    }
                    if (i < (grid.length - 1)) {
                        if (grid[i + 1][j] && !grid[i + 1][j].isBufferHex) { isConnectedToBug = true }
                        if (j < (grid[0].length - 1) && grid[i + 1][j + 1] && !grid[i + 1][j + 1].isBufferHex) { isConnectedToBug = true }
                    }
                }
                if (!isConnectedToBug) { grid[i][j] = '' }
            }
        }
    }
    //Keep the grid small, if one of the border is empty, remove it

    var isEmpty = true
    for (i = 0; i < grid[0].length; i++) { if (grid[0][i]) { isEmpty = false } }
    if (isEmpty) {
        isOddRowOffset = !isOddRowOffset
        grid.shift()
    }
    isEmpty = true
    //check if left col empty, if empty, remove first elem of each row
    for (i = 0; i < grid.length; i++) { if (grid[i][0]) { isEmpty = false } }
    if (isEmpty) {
        for (i = 0; i < grid.length; i++) { grid[i].shift() }
    }
    isEmpty = true
    //check if bot row empty, if empty remove last row
    for (i = 0; i < grid[0].length; i++) { if (grid[grid.length - 1][i]) { isEmpty = false } }
    if (isEmpty) { grid.pop() }
    isEmpty = true
    //check if right col empty,if empty remove the last elem of each row
    for (i = 0; i < grid.length; i++) { if (grid[i][grid[0].length - 1]) { isEmpty = false } }
    if (isEmpty) {
        for (i = 0; i < grid.length; i++) { grid[i].pop() }
    }

    const tempIsOddRowOffset = (isOddRowOffset ? true : false)


    //Grid maintenance finished
    return { grid, tempIsOddRowOffset }

}


export { gridMaintenance }
