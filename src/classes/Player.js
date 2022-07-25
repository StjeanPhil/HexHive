import Node from './Node'
import Bug from './Bug'



const startingHand = [
    [new Node(new Bug('Queen'))], //1xQueen
    [new Node(new Bug('Spider')), new Node(new Bug('Spider'))],//2xSpider
    [new Node(new Bug('Beetle')), new Node(new Bug('Beetle'))], //2xBeetle
    [new Node(new Bug('Grasshopper')), new Node(new Bug('Grasshopper')), new Node(new Bug('Grasshopper'))], //3xGrasshopper
    [new Node(new Bug('Ant')), new Node(new Bug('Ant')), new Node(new Bug('Ant'))] //3xAnt
]


export default class Player {
    isTurn = false;
    name;
    hand = [];//dict of bugs
    color;
    //Starting hand
    startingHand = [
        [new Node(new Bug('Queen'))], //1xQueen
        [new Node(new Bug('Spider')), new Node(new Bug('Spider'))],//2xSpider
        [new Node(new Bug('Beetle')), new Node(new Bug('Beetle'))], //2xBeetle
        [new Node(new Bug('Grasshopper')), new Node(new Bug('Grasshopper')), new Node(new Bug('Grasshopper'))], //3xGrasshopper
        [new Node(new Bug('Ant')), new Node(new Bug('Ant')), new Node(new Bug('Ant'))] //3xAnt
    ]

    constructor(name, color, starts) {
        this.name = name
        this.color = color
        this.hand = this.startingHand
        if (starts) { this.isTurn = true }
    }
    //Put Back all bugs in hand
    reset_Hand() {
        this.hand = this.defaultHand
    }
    //Remove 1 Bug from hand
    place_bug(Bug) {
        this.hand[Bug] -= 1
    }

}