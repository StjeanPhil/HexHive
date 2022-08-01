import React from 'react'
import Bug from '../classes/Bug'


const Hex = (props) => {
  const pts = props.pts
  const coord = props.coord
  const node = props.node
  const hexClick = props.hexClick
  const center = props.center

  var classes = 'hex'
  if (node && node.isBufferHex) { classes += ' bufferHex' }
  if (node && node.isSelected) { classes += ' selectedHex' }
  if (node && node.isAvailable) { classes += ' availableHex' }


  const clickHandler = () => {
    hexClick(coord)
    console.log('Hexagon [ ' + coord + ' ] clicked')
  }

  //used to show the multiple bugs of the same node
  const content = () => {
    //console.log(node.content)
    var toReturn = []

    for (var i = 0; i < node.content.length; i++) {
      if (node.content[i]) {
        toReturn.push(node.content[i].name)
      }
      // /toReturn.push(node.content[i].name)

    }

    return toReturn
  }

  return (
    <g>
      {content().map((bug, index) => {
        return <text x={center[0] - 30} y={center[1] + (10 * index)} key={index} >{bug}</text>
      })}
      <polygon className={classes} points={pts} onClick={clickHandler} ></polygon>
    </g>

  )
}

export default Hex