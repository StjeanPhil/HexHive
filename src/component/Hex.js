import React from 'react'
import './hive.css'
const Hex = (props) => {
  const pts = props.pts
  const coord = props.coord
  const node = props.node
  //console.log("node:")
  //console.log(node)
  var classes = 'hex'
  console.log(coord)
  if (node.isAvailable) { classes += ' availableHex' }
  const clickHandler = () => { console.log('Hexagon [ ' + coord + ' ] clicked') }

  return (
    <polygon className={classes} points={pts} onClick={clickHandler} ></polygon>
  )
}

export default Hex