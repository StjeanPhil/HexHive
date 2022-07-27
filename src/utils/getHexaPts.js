const getHexaPts = (TotalLength, TotalHeight, NbHexX, NbHexY, isOddRowOffset, oddRowBorder) => {




    var hexWidth = 0;
    var size = 0;
    var hexHeight = 0;

    //Get the size of a singular hex (height/length)
    const getHexSizing = (modelSize) => {
        //If we use the nb in a row to base our sizing
        if (modelSize === 'x') {

            hexWidth = (NbHexX === 1 ? TotalLength : (TotalLength / (NbHexX + 0.5)))

            //Hexagon with formula: w=sqrt(3)* size
            size = hexWidth / Math.sqrt(3)
            //Hexagon with formula: h=2*size
            hexHeight = 2 * size
            //If the total height of the grid is smaller than the sum of the hex's heigth, use the height to base the sizing
            if ((hexHeight * ((NbHexY * 0.75) + 0.25)) > TotalHeight) { getHexSizing('y') }
        }

        //If we use the nb of rowss to base our sizing
        if (modelSize === 'y') {
            //Singular hexagon heigth
            hexHeight = (TotalHeight / ((NbHexY * 0.75) + 0.25))
            //Hexagon with formula: h=2*size
            size = hexHeight / 2
            //Hexagon with formula: w=sqrt(3)* size
            hexWidth = size * Math.sqrt(3)
            //If the total length of the grid is smaller than the sum of the hex's width, use the width to base the sizing
            if ((hexWidth * (NbHexX + 0.5)) > TotalLength) { getHexSizing('x') }
        }
    }

    //If its more long than tall, determines sizing with max length
    (NbHexX >= (NbHexY * 0.866) ? getHexSizing('x') : getHexSizing('y'))







    //Get CenterPts :[horizon,vertical]    
    const centerPts = Array(NbHexY).fill().map(entry => Array(NbHexX))
    for (let i = 0; i < NbHexY; i++) {
        var adjustWidth = 0;
        if (NbHexY > 1) {
            if ((isOddRowOffset == true && !(i % 2)) || (isOddRowOffset == false && (i % 2))) { adjustWidth = hexWidth / 2 }
        }

        for (let j = 0; j < NbHexX; j++) {


            centerPts[i][j] = [j * hexWidth + hexWidth / 2 + adjustWidth, (i * (hexHeight * 0.75)) + size]
        }
    }
    //console.log(centerPts)
    //console.log("centerPts"+centerPts[0])







    //Get hexaPts from a centerPt(tout les sommets de lhexagone au centerpts correspondant)
    const hexaPts = Array(NbHexY).fill().map(entry => Array(NbHexX).fill().map(entry => Array(6)))
    //console.log(hexaPts)
    for (let i = 0; i < centerPts.length; i++) {
        for (let j = 0; j < centerPts[0].length; j++) {

            for (let z = 0; z < 6; z++) {
                const angle_deg = 60 * z - 30
                const angle_rad = Math.PI / 180 * angle_deg
                const point = [(centerPts[i][j][0] + size * Math.cos(angle_rad)).toFixed(4), (centerPts[i][j][1] + size * Math.sin(angle_rad)).toFixed(4)]

                hexaPts[i][j][z] = point
            }
        }

    }
    return { hexaPts, centerPts }
}

export { getHexaPts }
