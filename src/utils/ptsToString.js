const ptsToString = (hexagon) => {
    var toReturn = ''
    for (let i = 0; i < 6; i++) {
        toReturn += hexagon[i][0] + ',' + hexagon[i][1] + ' '

    }

    //console.log(toReturn)
    return toReturn
}

export { ptsToString }