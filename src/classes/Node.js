export default class Node {
    color = 'none'
    content = []
    id;
    image = ''
    isSelected = false
    isVisible = true
    isInBorder = false
    isAvailable = false
    isInPlay = false

    constructor(id) {
        this.id = id
    }
    setDisplay(file) {
        this.add_bugimage = file
    }
    add_bug(Bug) {
        this.content.push(Bug)
        this.setDisplay(Bug.image)
    }
    pop_Bug(Bug) {
        this.content.pop(Bug)
    }
    selectThis() {
        this.isSelected = true
    }
}
