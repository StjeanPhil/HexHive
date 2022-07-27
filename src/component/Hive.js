import React from 'react'
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

    const { hexaPts, centerPts } = getHexaPts(TotalLength, TotalHeight, NbHexX, NbHexY, isOddRowOffset)

    const clickHandler = (coord) => {
        hexClick(coord, 'hive')
    }

    return (
        <div className='boardContainer'>
            <svg className='board' version="1.1" width="100%" height="100%" viewBox="0 0 860 1000">
                {hexaPts.map((row, rowIndex) => {
                    return (row.map((hexagon, colIndex) => {
                        if (gameGrid[rowIndex][colIndex]) {
                            return <Hex hexClick={clickHandler} node={gameGrid[rowIndex][colIndex]} pts={ptsToString(hexagon)} center={centerPts[rowIndex][colIndex]} coord={[rowIndex, colIndex]} key={rowIndex + '-' + colIndex}></Hex>
                        }
                        return null
                    }))

                })}
            </svg>
        </div>

    )
}

export default Hive