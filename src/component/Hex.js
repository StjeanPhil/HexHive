import React from 'react'
import './hive.css'
const Hex = (props) => {
  const pts = props.pts
  const coord = props.coord
  const node = props.node
  const hexClick = props.hexClick
  const center = props.center

  //console.log("node:")
  //console.log(node)
  var classes = 'hex'
  if (node && node.isAvailable) { classes += ' availableHex' }
  const clickHandler = () => {
    hexClick(coord)
    console.log('Hexagon [ ' + coord + ' ] clicked')
  }

  return (
    <g>

      <polygon className={classes} points={pts} onClick={clickHandler} ></polygon>

    </g>

  )
}

export default Hex