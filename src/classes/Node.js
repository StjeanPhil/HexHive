export default class Node {
    color = 'none'
    content = []
    id;
    image = ''
    isSelected = false
    isAvailable = false
    isBufferHex = true
    ownedBy = -1;


    constructor(bugs) {
        if (bugs) { this.content = bugs }

    }
    setDisplay(file) {
        this.add_bugimage = file
    }
    add_bug(Bug) {
        this.content.unshift(Bug)
        this.setDisplay(Bug.image)
    }
    pop_Bug(Bug) {
        this.content.pop(Bug)
    }
    selectThis() {
        this.isSelected = true
    }
}