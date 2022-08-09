
//Remove the Available status on all the nodes of the grid we pass
//return the grid
const hideAvailableNodes = (grid) => {

    console.log('hide')
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            if (grid[i][j]) {
                grid[i][j].isAvailable = false
            }
        }
    }
    return grid
}
export { hideAvailableNodes }