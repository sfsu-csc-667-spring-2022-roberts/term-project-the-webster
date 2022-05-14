const game = require("../db/game");
const db = require("../db");


const getInitialBag = () => {
    //might require getting a game Id first 
}

const getNumTilesInBag = () => {
    return 100;
}

const getInitialHand = (gameId, playerId) => {
    hand = Array();
    for(i = 0; i < 7; i++) {
        game.drawTile(gameId, playerId)
        .then(results => {
            //console.log(results);
            hand.push(results[0]);
        }).catch((err) => {
            console.log(err);
        })
    }
    console.log(hand);
    return hand;
}



 
//returns how much points a letter is worth 
const getLetterWorth = (letter) => {
    return db.one(`SELECT value FROM tiles WHERE letter=$1 LIMIT 1`, [letter])
    .then(result => {
        // console.log(result.value);
        return Promise.resolve(result.value);
    })
    .catch(err => {
        console.log("ERROR IN model/gameTiles IN getLetterWorth");
        return Promise.resolve(err);
    })
    /*for (i = 0; i < 7; i++) {
        console.log("in loop before the promise ")
        game.drawTile(gameId, playerId)
            .then(results => {
                console.log(results);
                hand.push(results);
            }).catch((err) => {
                console.log(err);
            })
    }*/
}

 
 

const getLetterFromTileId = (tile_id) => {
    return db.one(`SELECT letter FROM tiles WHERE id=$1`, [tile_id])
    .then(result => {
        // console.log("LETTER IS ", result)
        return Promise.resolve(result);
    })
    .catch(err => {
        console.log("ERROR IN getLetterFromTileId in models/gameTiles");
        return Promise.resolve(err);
    })
  }
  
const getCoordinatesFromTileId = (game_id, tile_id) => {
 
    return db.any(`SELECT x_coordinate, y_coordinate FROM game_tiles WHERE game_id=$1 AND tile_id=$2`,
    [game_id,tile_id])
    .then(result => {
        return Promise.resolve(result);
    })
    .catch(err => {
        console.log("ERROR IN getCoordinatesFromTileId in models/gameTiles");
        return Promise.resolve(err);
    })
 
  }
  
  const parsePlayerHandForHTML = (gameId, userId) => {
    let tileIdList = [];
    let letterList = [];
    let valueList = [];

    return game.getPlayerHand(gameId, userId)
    .then(handData => {
        tileIdList = handData;
        let promises = [];
        for (i=0; i < handData.length; i++) {
            promises.push(getLetterFromTileId(handData[i].tile_id));
        }

        return Promise.all(promises).then(results => {
            for (let result of results ) {
                letterList.push(result.letter);
            }
            return letterList;
        })
    })
    .then(letter_list => {
        for (i =0; i < letter_list.length; i++) {
            valueList.push(getLetterWorth(letter_list[i]));
        }
        return Promise.all(valueList).then(results => {
            valueList = results;
            return results;
        })
    })
    .then(value_list => {
        let htmlData = [];
        for (i=0;i<tileIdList.length;i++) {
            let letter = letterList[i];
            let value = valueList[i];
            let tileId = tileIdList[i].tile_id;
            htmlData.push({letter, value, tileId });
        }
        return Promise.resolve(htmlData);
    })

}
 
// playedCoords = [{x:'7',y:'0'}, {x:'7',y:'1'},  {x:'7',y:'2'}, {x:'7',y:'3'}]
horizontalCoords = [{x:'7',y:'4'}, {x:'7',y:'6'}, {x:'7',y:'7'}, {x:'7',y:'8'}]


playedCoords = [{x: '3',y:'6' } , {x: '4',y:'6' } , {x: '6',y:'6' } , {x: '7',y:'6' } ]
verticalCoords = [{x:'0', y: '6'},{x:'5',y:'6'}, {x:'11',y:'6'}, {x:'14', y: '6'}]

// playedCoords = [{x:'11',y:'6'}, {x:'11',y:'8'},  {x:'11',y:'9'}]
// horizontalCoords = [{x:'11',y:'0'}, {x:'11',y:'7'},{x:'11',y:'14'} ]

const getWords = (coordsArray, gameId) => {
    //verify horiozntal XOR very vertical
    if ( !((verifyHorizontal(coordsArray) && !verifyVertical(coordsArray)) || (!verifyHorizontal(coordsArray) && verifyVertical(coordsArray)))){
        
        return false;
    }
    //get all tiles in play
    game.getInPlayTiles(gameId)
    .then(results => {
        console.log(results);
    })
    
    //check the tiles which our playing tiles are touching 
        //find the coordinates of a gap of the passed in coords if a gap exists 
        //then check the gameBoard if there exists letter on the gap coords
            //throw error if there is no letter in any of the gap 
    


    //if not touching return or throw error 
    checkHorizontal(playedCoords, horizontalCoords)
    checkVertical(playedCoords, verticalCoords)
    //
}

function verifyHorizontal(arr) {
    for (i=0;i<arr.length;i++) {
        if (arr[i].x != arr[0].x) {
            return false;
        }
    }
    return true;
}

function verifyVertical(arr) {
    for (i=0;i<arr.length;i++) {
        if (arr[i].y != arr[0].y) {
            return false;
        }
    }
    return true;
}



function checkHorizontal(playedTiles, horizontalRow) {
    // for (i=0; i < horizontalRow.length; i++) {

    // }     //  | B R A V [E]   S E E        |

    returnArray = [];
    /*

    horizontal row =  [ placed tiles in the row ]. 

    */
    coordinates = []
    
    for ( const tile of horizontalRow){
        coordinates.push(Number((tile.y)))
    }

    otherCoordinates = []
    for ( const tile of playedTiles){
        otherCoordinates.push(Number((tile.y)))
    }

    console.log("playedTiles", playedTiles);
    console.log("horizontal row", horizontalRow);

    leftSide =[];
    rightSide = [];
    currentTile = playedTiles[0];
    curr = Number(currentTile.y);
    before = Number(currentTile.y) - 1;
    after = Number(currentTile.y) + 1;

    console.log("BEFORE => "+ before)
    console.log("AFTER => "+ after)
    // iterating left
    while( (coordinates.includes(before) || otherCoordinates.includes(before)) && before > -1) {
        leftSide.push(before)
        before--;
    }
        console.log("LEFT SIDE ", leftSide);


    // iterating right

     while( (coordinates.includes(after) || otherCoordinates.includes(after)) && after < 15) {
         
        rightSide.push(after)
        after++; 
   
    }   

        console.log("RIGHT SIDE", rightSide);

        leftSide.push(curr);
            console.log("LEFT SIDE AFTER ADDING CURRENT TILE ==> "  + leftSide)

        for ( const tile of rightSide ){
            leftSide.push(tile);
        }

        x = Number(playedTiles[0].x)

        for (y of leftSide) {
            returnArray.push( {x, y});
        }
            
        console.log("Horizontal Coords",returnArray);


        return returnArray;
}

function checkVertical(playedTiles, verticalRow) {
    // for (i=0; i < horizontalRow.length; i++) {

    // }     //  | B R A V [E]   S E E        |
    console.log("PLAYED TILES =>", playedTiles)
    console.log("VERTICAL ROW =>", verticalRow)
    returnArray = [];
    /*

    */
    coordinates = []
    
    for ( const tile of verticalRow){
        coordinates.push(Number((tile.x)))
    }

    otherCoordinates = []
    for ( const tile of playedTiles){
        otherCoordinates.push(Number((tile.x)))
    }


    aboveSide =[];
    belowSide = [];
    currentTile = playedTiles[0];
    curr = Number(currentTile.x);
    above = Number(currentTile.x) - 1;
    below = Number(currentTile.x) + 1;
    // iterating left
    while( (coordinates.includes(above) || otherCoordinates.includes(above)) && above > -1) {
        aboveSide.push(above)
        before--;
    }
        console.log("ABOVE SIDE ", aboveSide);


    // iterating right

     while( (coordinates.includes(below) || otherCoordinates.includes(below)) && below < 15) {
         
        belowSide.push(below)
        below++; 
   
    }   
        
    console.log("Below SIDE ", belowSide);


        aboveSide.push(curr);

        for ( const tile of belowSide ){
           aboveSide.push(tile);
        }

        y = Number(playedTiles[0].y);

        for (x of belowSide) {
            returnArray.push( {x, y});
        }
            
        console.log("Vertical Coords", returnArray);


        return returnArray;
}


//{EAAI, HAL, UAY, SI}

 

module.exports = {
    getInitialBag,
    getNumTilesInBag,
    getLetterWorth,
    getInitialHand,
 
    getLetterFromTileId,
    getCoordinatesFromTileId,
    parsePlayerHandForHTML,
 
    getCoordinatesFromTileId,
    getWords
 
}