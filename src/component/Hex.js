import React from 'react'
import './hive.css'
const Hex = (props) => {
   const pts= props.pts
  return (
    <polygon className='hex' points={pts} ></polygon>
  )
}

export default Hex