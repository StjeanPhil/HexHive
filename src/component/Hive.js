import React from 'react'
import './hive.css'
//import Hex from './Hex'

const Hive = (props) => {
    const {gameGrid}= props
    //console.log(gameGrid)
    //Passed by props
    //Max Total is 1000
    const TotalLength=1000
    //const TotalHeigth=1000
    //const NbHexHorizontal=10
    const NbHexHorizontal=gameGrid[0].length
    console.log(gameGrid[0].length)
    const NbHexVertical=1
    if(gameGrid[0][0].length!=undefined){NbHexVertical=gameGrid[0][0].length}
    
    const hexaPtsString=[]

    
    const hexWidth = (TotalLength/NbHexHorizontal)*0.95 
    //Hexagon with formula: w=sqrt(3)* size
    const size=hexWidth/Math.sqrt(3)
    //Hexagon with formula: h=2*size
    const hexHeight=2*size
    //Get CenterPts :[horizon,vertical]    
    const centerPts=[]
    for(let i=0;i<NbHexVertical;i++){
        var adjustWidth=0;
        if(i%2){adjustWidth=hexWidth/2}
        for(let j=0;j<NbHexHorizontal;j++){
            centerPts.push([j*hexWidth+hexWidth/2+adjustWidth,(i*(hexHeight*0.75))+size])
        }
    }
    //console.log("centerPts"+centerPts[0])
    //Get hexaPts from a centerPt(tout les sommets de lhexagone au centerpts correspondant)
    const hexaPts=[];
    for(let i=0;i<centerPts.length;i++){
        hexaPts.push([])
        for(let j=0;j<6;j++){
            const  angle_deg = 60 *j-30
            const angle_rad = Math.PI /180* angle_deg
            const point=[(centerPts[i][0]+size * Math.cos(angle_rad)).toFixed(4),(centerPts[i][1]+size*Math.sin(angle_rad)).toFixed(4)]
            hexaPts[i][j]=point
        }
    }
    //console.log("hexaPts "+hexaPts[0])
    //HexaPts to stringPts
    
    for(let i=0;i<hexaPts.length;i++){
        
        
            var ptsString=''
            for(let j=0;j<hexaPts[i].length;j++){
                ptsString+=Math.round(hexaPts[i][j][0])+','+Math.round(hexaPts[i][j][1])+' '
            }
            hexaPtsString.push(ptsString)
        

    }
    //console.log("hexaPtsString"+hexaPtsString)

    





    const clickHandler=(hexindex)=>{console.log('Hexagon #'+hexindex+' clicked')}

  return (
        <div>
            <svg  version="1.1" width="90%" height="90%" viewBox="0 0 1000 1000">
                {hexaPtsString.map((hex,index)=>{
                    //console.log("Hex "+hex)
                    return  <polygon className='hex' points={hex} onClick={()=>clickHandler(index)} key={index}></polygon>
                })}
            </svg>
        </div>       
  )
}

export default Hive

