import React from 'react'

const Hand = (player) => {
  return (
    //<div>Hand</div>
        <svg width='100%' height='100%' viewBox="0 0 100 100" preserveAspectRatio="none" style='background-color: whitesmoke'>
        <rect x='40%' y='40%' width='25%' height='25%' />

        <polygon points="0,0 0,100 30,20 30,0" />
        <polygon points="30,0 30,20 60,0 60,0" />
        <polygon points="60,0 60,0 90,30 90,0" />
    </svg>
  )
}

export default Hand