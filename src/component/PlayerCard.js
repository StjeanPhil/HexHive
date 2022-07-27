import React from 'react'
import { getHexaPts } from '../utils/getHexaPts'
import { ptsToString } from '../utils/ptsToString'
import Hex from './Hex'




const PlayerCard = (props) => {

  const rules = props.rules
  const hexClick = props.hexClick

  const player = props.player
  const name = player.name
  var hand = player.hand

  var NbHexX = Object.keys(hand).length
  var NbHexY = 1
  const TotalLength = 500
  const TotalHeight = 86
  const { hexaPts, centerPts } = getHexaPts(TotalLength, TotalHeight, NbHexX, NbHexY, 'true', 'true')

  const clickHandler = (coord) => {
    hexClick(coord, 'hand')
  }

  return (
    <div className='playerCard'>
      <div>{name}</div>
      <svg className='playerHand' version="1.1" viewBox="0 0 370 86">
        {hexaPts[0].map((hexagon, index) => {
          return <Hex hexClick={clickHandler} node={hand[index]} pts={ptsToString(hexagon)} center={centerPts[0][index]} coord={[0, index]} key={'0 -' + index} ></Hex>
        })}
      </svg>
    </div >
  )
}

export default PlayerCard