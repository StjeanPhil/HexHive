import React from 'react'
import './hive.css'
import Hex from './Hex'

const Hive = (props) => {
    const { gameGrid, hexClick, oddOffset } = props
    //console.log('GameGrid:')
    //console.log(gameGrid)

    //The grid is contained in a viewBox of 1000 by 866
    const TotalLength = 860
    const TotalHeight = 1000

    const NbHexX = gameGrid[0].length
    const NbHexY = gameGrid.length
    //console.log("nbhexX: " + NbHexX)
    //console.log("nbhexY: " + NbHexY)

    var hexWidth = 0;
    var size = 0;
    var hexHeight = 0;

    const getHexSizing = (modelSize) => {
        if (modelSize === 'x') {

            //Singular hexagon width
            if (NbHexX === 1) {
                //console.log('singularHex')

            }
            hexWidth = (NbHexX === 1 ? TotalLength : (TotalLength / (NbHexX + 0.5)))
            //Hexagon with formula: w=sqrt(3)* size
            size = hexWidth / Math.sqrt(3)
            //Hexagon with formula: h=2*size
            hexHeight = 2 * size
            if ((hexHeight * ((NbHexY * 0.75) + 0.25)) > TotalHeight) { getHexSizing('y') }
        }
        if (modelSize === 'y') {
            //Singular hexagon heigth
            hexHeight = (TotalHeight / ((NbHexY * 0.75) + 0.25))
            //Hexagon with formula: h=2*size
            size = hexHeight / 2
            //Hexagon with formula: w=sqrt(3)* size
            hexWidth = size * Math.sqrt(3)
            if ((hexWidth * (NbHexX + 0.5)) > TotalLength) { getHexSizing('x') }
        }
    }

    //If its more long than tall, determines sizing with max length
    (NbHexX >= NbHexY ? getHexSizing('x') : getHexSizing('y'))


    //Get CenterPts :[horizon,vertical]    
    const centerPts = Array(NbHexY).fill().map(entry => Array(NbHexX))
    for (let i = 0; i < NbHexY; i++) {
        var adjustWidth = 0;
        if ((oddOffset == true && !(i % 2)) || (oddOffset == false && (i % 2))) { adjustWidth = hexWidth / 2 }
        if (i === 0) { adjustWidth = 0 }
        for (let j = 0; j < NbHexX; j++) {
            centerPts[i][j] = [j * hexWidth + hexWidth / 2 + adjustWidth, (i * (hexHeight * 0.75)) + size]
        }
    }
    //console.log(centerPts)
    //console.log("centerPts"+centerPts[0])

    //Get hexaPts from a centerPt(tout les sommets de lhexagone au centerpts correspondant)
    const hexaPts = Array(NbHexY).fill().map(entry => Array(NbHexX).fill().map(entry => Array(6)))
    //console.log(hexaPts)
    for (let i = 0; i < centerPts.length; i++) {
        for (let j = 0; j < centerPts[0].length; j++) {

            for (let z = 0; z < 6; z++) {
                const angle_deg = 60 * z - 30
                const angle_rad = Math.PI / 180 * angle_deg
                const point = [(centerPts[i][j][0] + size * Math.cos(angle_rad)).toFixed(4), (centerPts[i][j][1] + size * Math.sin(angle_rad)).toFixed(4)]
                hexaPts[i][j][z] = point
            }
        }

    }
    //console.log('hexapts: ')
    //console.log(hexaPts)


    const ptsToString = (hexagon) => {
        var toReturn = ''
        for (let i = 0; i < 6; i++) {
            toReturn += hexagon[i][0] + ',' + hexagon[i][1] + ' '

        }

        //console.log(toReturn)
        return toReturn
    }



    return (

        <svg className='board' version="1.1" width="100%" height="100%" viewBox="0 0 860 1000">
            {hexaPts.map((row, rowIndex) => {
                //console.log('row: ' + row)

                return (row.map((hexagon, colIndex) => {
                    //console.log('hexagon: ' + hexagon)
                    //console.log('node: ')
                    //console.log(gameGrid[rowIndex][colIndex])
                    if (gameGrid[rowIndex][colIndex]) {
                        return <Hex hexClick={hexClick} node={gameGrid[rowIndex][colIndex]} pts={ptsToString(hexagon)} coord={[rowIndex, colIndex]} key={rowIndex + '-' + colIndex}></Hex>
                    }

                    return null


                }))

                //console.log("Hex "+hex)

            })}
        </svg>

    )
}

export default Hive