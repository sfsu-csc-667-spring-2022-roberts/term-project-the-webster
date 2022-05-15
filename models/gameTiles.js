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


const getLetterFromCoords = (coords, gameId) => {
    return db.one(`SELECT tile_id FROM game_tiles WHERE x_coordinate=$1 AND y_coordinate=$2 AND game_id=$3 `,
    [coords.x, coords.y, gameId])
    .then(result => {
        return Promise.resolve(result);
    })
    .catch(err => {
        console.log("ERROR IN getLetterFromCoords in models/gameTiles");
        return Promise.resolve(err);
    })
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


const getScoreFromWords = (arr) => {
    let words = [];
    for (let word of arr) {
        words.push(getWordWorth(word));
    }
    return Promise.all(words).then(results => {
        score = 0;
        for (let point of results) {
            score += point;
        }
        return Promise.resolve(score);
    })
    .catch(err => {
        console.log("ERROR IN models/gameTiles in getScoreFromWords");
        Promise.resolve(err);
    })
}

const getWordWorth = (word) => {
    let letters = [];
    let upperWord = word.toUpperCase();
    for (let letter of upperWord.split('')) {
        letters.push(getLetterWorth(letter));
    }
    return Promise.all(letters).then(results => {
        worth = 0;
        console.log("results", results);
        for (let point of results) {
            worth += point;
        }
        return Promise.resolve(worth);
    })
    .catch(err => {
        console.log("ERROR IN models/gameTiles in getWorthWorth");
        Promise.resolve(err);
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
        horizontalCoords = [];
        verticalCoords = [];

        for (let coords of coordsArray) {
            for (let playedTile of results) {

                if (coords.x == playedTile.x_coordinate) {

                    if(!horizontalCoords.includes(playedTile)){

                        horizontalCoords.push(playedTile);
                    }
                }
                if (coords.y == playedTile.y_coordinate) {

                    if(!verticalCoords.includes(playedTile)){
                        verticalCoords.push(playedTile);
                    }
                }
            }
        }
        arr1 = checkHorizontal(coordsArray, horizontalCoords)
        arr2 = checkVertical(coordsArray, verticalCoords)

        let wordSet = [];
        if(arr1 != false) {
            for (let ele of arr1) {
                wordSet.push(ele);
            }
        }

        if (arr2 != false){
            for (let ele of arr2) {
                wordSet.push(ele);
            }
        }
        clean = multiDimensionalUnique(wordSet);
        return clean;
    })
    .catch(err => {
        console.log("ERROR IN models/gameTiles",err);

    })
}

const getWordsFromArray = (coordsList, gameId) => {

    returnArr = [];
    wordsArr = [];
    //take the word list for each things get the letter from the db using coords
    for (let list of coordsList) {
        wordsArr.push(getWordFromArrayHelper(list));
    }
    return Promise.all(wordsArr).then(results => {
        for (let word of results) {
            let string = word.join("");
            returnArr.push(string.toLowerCase());
        }
        return returnArr;
    })
    .catch(err => {
        console.log("ERROR IN model/gameTiles getWordsFromArray");
        Promise.resolve(err);
    })
}

const getWordFromArrayHelper = (list) => {
    promises = [];
    for (let coord of list) {
        promises.push(getLetterFromTileId(coord.tile_id));
    }
    return Promise.all(promises).then(results => {
        word = [];
        for(let letter of results) {
            word.push(letter.letter);
        }
        string = word.join("");
        return Promise.resolve(word);
    })
    .catch(err => {
        console.log("ERROR IN model/gameTiles getWordFromArray Helper function");
        console.log(err);
    })
}

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        if(itemsFound[arr[i]]) { continue; }
        uniques.push(arr[i]);
        itemsFound[arr[i]] = true;
    }
    return uniques;
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

    if (horizontalRow.length == 0) {
        return false;
    }

    returnArray = [];
    boardCoordinates = []
  
    for ( const tile of horizontalRow){
        boardCoordinates.push({tile_id: tile.tile_id , x: Number((tile.x_coordinate)), y: Number((tile.y_coordinate)) })
    }

    playingCoordinates = []
    for ( const tile of playedTiles){
        playingCoordinates.push( {tile_id: tile.tile_id, x:Number((tile.x)),y: Number((tile.y))} )
    }
    for(i = 0; i < playingCoordinates.length;i++) {
        leftSide =[];
        rightSide = [];
        currentTile = playingCoordinates[i];
        previousTile = {x: currentTile.x, y: currentTile.y - 1 };
        nextTile = {x: currentTile.x, y: currentTile.y + 1 };

        while(  ((includesJson(boardCoordinates, previousTile) != -1 ) || (includesJson(playingCoordinates, previousTile) != -1) ) && previousTile.y > -1) {
            let tileId = -1;
            if (includesJson(boardCoordinates, previousTile) != - 1) {
                tileId = includesJson(boardCoordinates, previousTile);
            }

            if (includesJson(playingCoordinates, previousTile) != - 1) {
                tileId = includesJson(playingCoordinates, previousTile);
            }
            let toPushTile = {tile_id: tileId, x: previousTile.x, y: previousTile.y};
            
            leftSide.push(toPushTile);
            previousTile.y--;
        }

        // iterating right
        while( ((includesJson(boardCoordinates, nextTile) != -1 ) || (includesJson(playingCoordinates, nextTile)) != -1)  && nextTile.y < 15) {
            let tileId = -1;
            if (includesJson(boardCoordinates, nextTile) != - 1) {
                tileId = includesJson(boardCoordinates, nextTile);
            }

            if (includesJson(playingCoordinates, nextTile) != - 1) {
                tileId = includesJson(playingCoordinates, nextTile);
            }
            let toPushTile = {tile_id: tileId, x: nextTile.x, y: nextTile.y};
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

            newTempArr = sortJsonByY(tempArr);
            returnArray.push(newTempArr);
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
        boardCoordinates.push({tile_id: tile.tile_id , x: Number((tile.x_coordinate)), y: Number((tile.y_coordinate)) })
    }
    playingCoordinates = []
    for ( const tile of playedTiles){
        playingCoordinates.push( {tile_id: tile.tile_id , x:Number((tile.x)),y: Number((tile.y))} )
    }

    for(i = 0; i < playingCoordinates.length;i++) {
        aboveSide =[];
        belowSide = [];
        currentTile = playingCoordinates[i];
        previousTile = {x: currentTile.x-1, y: currentTile.y };
        nextTile = {x: currentTile.x + 1, y: currentTile.y };
        // iterating left
        while( ((includesJson(boardCoordinates, previousTile) != -1) || (includesJson(playingCoordinates, previousTile) != -1) ) && previousTile.x > -1) {
            let tileId = -1;
            if (includesJson(boardCoordinates, previousTile) != - 1) {
                tileId = includesJson(boardCoordinates, previousTile);
            }

            if (includesJson(playingCoordinates, previousTile) != - 1) {
                tileId = includesJson(playingCoordinates, previousTile);
            }
            let toPushTile = {tile_id: tileId, x: previousTile.x, y: previousTile.y};
            aboveSide.push(toPushTile)
            previousTile.x--;
        }


        // iterating right

        while( ((includesJson(boardCoordinates, nextTile) != -1)  || includesJson(playingCoordinates, nextTile) != -1)  && nextTile.x < 15) {
            let tileId = -1;
            if (includesJson(boardCoordinates, nextTile) != - 1) {
                tileId = includesJson(boardCoordinates, nextTile);
            }

            if (includesJson(playingCoordinates, nextTile) != - 1) {
                tileId = includesJson(playingCoordinates, nextTile);
            }
            let toPushTile = {tile_id: tileId, x: nextTile.x, y: nextTile.y};
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
            newTempArr = sortJsonByX(tempArr);
            returnArray.push(newTempArr);
        }
    }
    return returnArray;
}

// testArr = [{ x:7, y:5  }, {x:8, y:9}]

// const x = {x:7, y:5}

function includesJson(arr, target) {
    for ( const item  of arr){
        if(item.x == target.x && item.y == target.y){
            return item.tile_id;
        }
    }
    return -1;
}


//{EAAI, HAL, UAY, SI}

 
function sortJsonByX(arr){
    let deep_cpy = [...arr]
    let sortedInput = deep_cpy.slice().sort((a, b) => a.x - b.x);
    return sortedInput;
}

function sortJsonByY(arr){
    let deep_cpy = [...arr]
    let sortedInput = deep_cpy.slice().sort((a, b) => a.y - b.y);
    return sortedInput;
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
    getWords,
    getWordsFromArray,
    getScoreFromWords
 
 
}