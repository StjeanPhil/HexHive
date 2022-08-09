export default class Bug {
    name;
    image;
    ownedBy;
    constructor(name, player) {
        this.name = name
        this.image = '../images/' + name
        this.ownedBy = player
    }
}