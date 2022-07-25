import React from 'react'
import './hive.css'
import Hex from './Hex'
import { ptsToString } from '../utils/ptsToString'
import { getHexaPts } from '../utils/getHexaPts'

const Hive = (props) => {
    const { gameGrid, hexClick, isOddRowOffset } = props

    //The grid is contained in a viewBox of 1000 by 866
    const TotalLength = 860
    const TotalHeight = 1000

    const NbHexX = gameGrid[0].length
    const NbHexY = gameGrid.length
    //console.log("nbhexX: " + NbHexX)
    //console.log("nbhexY: " + NbHexY)

    // idk yet if this useful, was a wip fix for the grid
    var oddRowBorder = true
    for (let i = 0; i < gameGrid.length; i += 2) {
        if (gameGrid[i][0] && gameGrid[i][0].isVisible) { oddRowBorder = false }
    }

    const { hexaPts, centerPts } = getHexaPts(TotalLength, TotalHeight, NbHexX, NbHexY, isOddRowOffset, oddRowBorder)

    const clickHandler = (coord) => {
        hexClick(coord)
    }


    return (
        <div className='boardContainer'>
            <svg className='board' version="1.1" width="100%" height="100%" viewBox="0 0 860 1000">
                {hexaPts.map((row, rowIndex) => {
                    //console.log('row: ' + row)

                    return (row.map((hexagon, colIndex) => {
                        //console.log('hexagon: ' + hexagon)
                        //console.log('node: ')
                        //console.log(gameGrid[rowIndex][colIndex])
                        if (gameGrid[rowIndex][colIndex]) {
                            return <Hex hexClick={clickHandler} node={gameGrid[rowIndex][colIndex]} pts={ptsToString(hexagon)} center={centerPts[rowIndex][colIndex]} coord={[rowIndex, colIndex]} key={rowIndex + '-' + colIndex}></Hex>
                        }

                        return null


                    }))

                    //console.log("Hex "+hex)

                })}
            </svg>
        </div>

    )
}

export default Hive