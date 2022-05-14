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
// horizontalCoords = [{x:'7',y:'4'}, {x:'7',y:'6'}, {x:'7',y:'7'}, {x:'7',y:'8'}]


// playedCoords = [{x: '3',y:'6' } , {x: '4',y:'6' } , {x: '6',y:'6' } , {x: '7',y:'6' } ]
// verticalCoords = [{x:'0', y: '6'},{x:'5',y:'6'}, {x:'11',y:'6'}, {x:'14', y: '6'}]

// playedCoords = [{x:'11',y:'6'}, {x:'11',y:'8'},  {x:'11',y:'9'}]
// horizontalCoords = [{x:'11',y:'0'}, {x:'11',y:'7'},{x:'11',y:'14'} ]

const getWords = (coordsArray, gameId) => {
    //verify horiozntal XOR very vertical
    if ( !((verifyHorizontal(coordsArray) && !verifyVertical(coordsArray)) || (!verifyHorizontal(coordsArray) && verifyVertical(coordsArray)))){
        
        return false;
    }
    //get all tiles in play
    return game.getInPlayTiles(gameId)
    .then(results => {
        // console.log("results are", results);
        horizontalCoords = [];
        verticalCoords = [];

        for (let coords of coordsArray) {
            for (let playedTile of results) {
                // console.log("Played Tile ", playedTile);
                // console.log("coords ", coords)
                if (coords.x == playedTile.x_coordinate) {
                    // console.log("pushing into HORIZONTAL");
                    // console.log("COORDS ARE ", coords, "PLAYED COORDS ARE ", playedTile)
                    if(!horizontalCoords.includes(playedTile)){
                    // console.log("pushing into HORIZONTAL");
                    // console.log("COORDS ARE ", coords, "PLAYED COORDS ARE ", playedTile);
                        horizontalCoords.push(playedTile);
                    }
                }
                if (coords.y == playedTile.y_coordinate) {
                    // console.log("pushing into VERTICAL");
                    // console.log("COORDS ARE ", coords, "PLAYED COORDS ARE ", playedTile);
                    if(!verticalCoords.includes(playedTile)){
                        verticalCoords.push(playedTile);
                    }
                }
            }
        }

        // console.log("horizontal coords", horizontalCoords);
        // console.log("vertical coords", verticalCoords);
        arr1 = checkHorizontal(coordsArray, horizontalCoords)
        arr2 = checkVertical(coordsArray, verticalCoords)
        // console.log('arr1: ', arr1);
        // console.log('arr2: ', arr2);

        let wordSet = new Set();
        if(arr1 != false) {
            for (let ele of arr1) {
                wordSet.add(ele);
            }
        }

        if (arr2 != false){
            for (let ele of arr2) {
                wordSet.add(ele);
            }
        }
        return wordSet;
    })
    .catch(err => {
        console.log("ERROR IN models/gameTiles",err);

    })
    //check the tiles which our playing tiles are touching 
        //find the coordinates of a gap of the passed in coords if a gap exists 
        //then check the gameBoard if there exists letter on the gap coords
            //throw error if there is no letter in any of the gap 
    


    //if not touching return or throw error 

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

    if (horizontalRow.length == 0) {
        return false;
    }

    returnArray = [];
    boardCoordinates = []
  
    for ( const tile of horizontalRow){
        boardCoordinates.push({ x: Number((tile.x_coordinate)), y: Number((tile.y_coordinate)) })
    }

    playingCoordinates = []
    for ( const tile of playedTiles){
        playingCoordinates.push( {x:Number((tile.x)),y: Number((tile.y))} )
    }

    // console.log("board coords are ", boardCoordinates);
    // console.log("playing Coordinates ", playingCoordinates);
    // curr = Number(currentTile.y);
    for(i = 0; i < playingCoordinates.length;i++) {
        leftSide =[];
        rightSide = [];
        currentTile = playingCoordinates[i];
        previousTile = {x: currentTile.x, y: currentTile.y - 1 };
        nextTile = {x: currentTile.x, y: currentTile.y + 1 };
        // iterating left


        while(  (includesJson(boardCoordinates, previousTile) || includesJson(playingCoordinates, previousTile) ) && previousTile.y > -1) {
            let toPushTile = {...previousTile}
            leftSide.push(toPushTile);
            previousTile.y--;
        }

        // iterating right
        while( (includesJson(boardCoordinates, nextTile)  || includesJson(playingCoordinates, nextTile))  && nextTile.y < 15) {
            let toPushTile = {...nextTile};
            rightSide.push(toPushTile)
            nextTile.y++; 
        }   

        leftSide.push(currentTile);

        for ( const tile of rightSide ){
            leftSide.push(tile);
        }

        // console.log("LEFT SIDE THERE0", leftSide);
        if(leftSide.length > 1) {
            tempArr = [];
            for (y of leftSide) {
                tempArr.push( y);
            }

            returnArray.push(tempArr);
        }
    }
    return returnArray;
}

function checkVertical(playedTiles, verticalRow) {

    if (verticalRow.length == 0) {
        return false;
    }
    returnArray = [];
    boardCoordinates = []
    for ( const tile of verticalRow){
        boardCoordinates.push({ x: Number((tile.x_coordinate)), y: Number((tile.y_coordinate)) })
    }
    playingCoordinates = []
    for ( const tile of playedTiles){
        playingCoordinates.push( {x:Number((tile.x)),y: Number((tile.y))} )
    }

    for(i = 0; i < playingCoordinates.length;i++) {
        aboveSide =[];
        belowSide = [];
        currentTile = playingCoordinates[i];
        previousTile = {x: currentTile.x-1, y: currentTile.y };
        nextTile = {x: currentTile.x + 1, y: currentTile.y };
        // iterating left
        while( (includesJson(boardCoordinates, previousTile) || includesJson(playingCoordinates, previousTile) ) && previousTile.x > -1) {
            let toPushTile = {...previousTile}
            aboveSide.push(toPushTile)
            previousTile.x--;
        }


        // iterating right

        while( (includesJson(boardCoordinates, nextTile)  || includesJson(playingCoordinates, nextTile))  && nextTile.x < 15) {
            let toPushTile = {...nextTile}
            aboveSide.push(toPushTile)
            nextTile.x++;
        }   
            
        aboveSide.push(currentTile);

        for ( const tile of belowSide ){
            aboveSide.push(tile);
        }

        if (aboveSide.length > 1) {
            tempArr = [];
            for (x of aboveSide) {
                tempArr.push(x);
            }
            sortJsonByX(tempArr);
            returnArray.push(tempArr);
        }
    }
    console.log("VERTICAL RETURN", returnArray); 
    // console.log("RETURN ARRAY FROM VERTICAL IS", returnArray);
    return returnArray;
}

// testArr = [{ x:7, y:5  }, {x:8, y:9}]

// const x = {x:7, y:5}

function includesJson(arr, target) {
    for ( const item  of arr){
        if(item.x == target.x && item.y == target.y){
            return true
        }

    }
    return false;
}


//{EAAI, HAL, UAY, SI}

 
function sortJsonByX(arr){

    let values = [] 
    // for ( const x of arr){
        let tmp = [] 
        for ( const i of arr){
            tmp.push(i.x)
        }
        values.push(tmp)
    values[0].sort(function(a, b){return a-b});

    const firstWordCombo = arr
    for ( const i in firstWordCombo){
        firstWordCombo[i].x = values[0][i]
    }
    console.log("VALUES" ,values);
}
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