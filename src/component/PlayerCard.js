import React from 'react'

const PlayerCard = (props) => {
  const player = props.player
  const name = player.name
  //console.log(name+' joined the game')

  return (
    <div>{name}</div>
  )
}

export default PlayerCard