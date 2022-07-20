import React from 'react'
import Title from './Title'
import Hive from './Hive'
import PlayerCard from './PlayerCard'

class Node{
  color='none'
  content=[]
  id;
  image=''
  isSelected=false
  constructor(id){
    this.id=id
  }
  setDisplay(file){
    this.add_bugimage=file
  }
  add_bug(Bug){
    this.content.push(Bug)
    this.setDisplay(Bug.image)
  }
  pop_Bug(Bug){
    this.content.pop(Bug)
  }    
}

class Bug{
  name;
  image;

  constructor(name){
    this.name=name
    this.image='../images/'+name
  }
}

class Player{
  isTurn=false;
  name;
  hand=[];//dict of bugs
  color;
  //Starting hand
  defaultHand={
      "Queen":1,
      "Spider":2,
      "Beetle":2,
      "Grasshopper":3,
      "Ant":3
    }
  constructor(name,color,starts){
    this.name=name
    this.color=color
    this.hand=this.defaultHand
    if(starts){this.isTurn=true}
  }
  //Put Back all bugs in hand
  reset_Hand(){
    this.hand=this.defaultHand
  }
  //Remove 1 Bug from hand
  place_bug(Bug){
    this.hand[Bug]-=1
  }
  
}


class Game extends React.Component{
  constructor(props){
    super(props)
    this.state={
      gameGrid:[[new Node()]],
      players:[new Player("Player1","white",true),new Player("Player2","Black",false)],
      selectedNode:{
        "isSelect":false,
        "isInHand":false,
        "bugName":'',
        "coord":[]
      }
      
    }
  }
  //Move a bug already in play
  move_bug(startNode,endNode,player){}
  //Place a bug from the player's hand
  place_bug(endNode,player){}
  //check passedGamegrid for complete and singular connection of the the bugs
  verifyConnection(possibleGameGrid){}
  //Show all possible distinations
  showPossibleNodes(node){}


  render(){
      return (
        <>
          <Title/>
          <Hive gameGrid={this.state.gameGrid}/>
          <button onClick={this.place_bug()}></button>
          <PlayerCard player={this.state.players[0]}/>
          <PlayerCard player={this.state.players[1]}/>

        </>)
  }

}

export default Game