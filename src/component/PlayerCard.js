import React from 'react'
import { getHexaPts } from '../utils/getHexaPts'
import { ptsToString } from '../utils/ptsToString'
import Hex from './Hex'




const PlayerCard = (props) => {

  const rules = props.rules
  const player = props.player
  const name = player.name
  var hand = player.hand



  var hand = player.hand
  var NbHexX = Object.keys(hand).length
  var NbHexY = 1

  //console.log(NbHexX)

  const TotalLength = 500
  const TotalHeight = 86

  const { hexaPts, centerPts } = getHexaPts(TotalLength, TotalHeight, NbHexX, NbHexY, 'true', 'true')




  const clickHandler = (coord) => {
    console.log("Hand" + coord)
  }



  //console.log(hand)


  //console.log(name+' joined the game')

  return (
    <div className='playerCard'>
      <div>{name}</div>
      <svg className='playerHand' version="1.1" viewBox="0 0 370 86">
        {hexaPts.map((row, rowIndex) => {
          //console.log('row: ' + row)

          return (row.map((hexagon, colIndex) => {
            //return <polygon points={ptsToString(hexagon)} key={rowIndex + '-' + colIndex} ></polygon>

            return <Hex hexClick={clickHandler} node={hand[0][colIndex]} pts={ptsToString(hexagon)} center={centerPts[0][colIndex]} coord={[rowIndex, colIndex]} key={rowIndex + '-' + colIndex} ></Hex>
            //return <Hex node={hand[0][colIndex]} pts={ptsToString(hexagon)} coord={[rowIndex, colIndex]} key={rowIndex + '-' + colIndex} image={hand[0][colIndex].image}></Hex>
          }))
        })}





      </svg>



    </div >
  )
}

export default PlayerCard