const game = require("../db/game");
const db = require("../db");
const gameBoard = require("./gameBoard")

const getInitialBag = () => {
    //might require getting a game Id first 
}

const getNumTilesInBag = () => {
    return 100;
}

const getInitialHand = async (gameId, playerId) => {
    return await game.drawTile(gameId, playerId, 7)
    .then(async () => {
        return await game.getPlayerHand(gameId, playerId)
        .then(hand => {
            console.log("-----hand: ");
            console.log(hand);
            return Promise.resolve(hand);
        })
        .catch(err => {
            console.log("err in initial hand: " + err);
        })
    })
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
 
 

const getLetterFromTileId = async (tile_id) => {
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
  
const getCoordinatesFromTileId = async (game_id, tile_id) => {
 
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

    console.log("INPUT TO GET WORDS", coordsArray);
    //verify horiozntal XOR very vertical
    if ( !((verifyHorizontal(coordsArray) && !verifyVertical(coordsArray)) || (!verifyHorizontal(coordsArray) && verifyVertical(coordsArray)))){
        console.log("NO DIAGONAL!!!!!!!!!")
        return ["invalid move"];
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


        //for the case of first turn where there are no tiles in the board
        if(horizontalCoords.length == 0 && verticalCoords.length == 0) {
            returnArr = [];
            for (let tile of coordsArray) {
                returnArr.push({ tile_id: Number(tile.id), x: Number(tile.x), y: Number(tile.y)})
            }
            if(returnArr[0].x == returnArr[returnArr.length -1].x){
                console.log("FIRST TURN X's are the same!!! ")
                returnArr = sortJsonByY(returnArr)
            }
            if(returnArr[0].y == returnArr[returnArr.length -1].y){
                console.log("FIRST TURN Y's are the same!!! ") 
                returnArr = sortJsonByX(returnArr)
            }
            let modifiedReturnArr = addValueTo2DArrayJson([returnArr]);
            return modifiedReturnArr;
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
        let modifiedReturnArr = addValueTo2DArrayJson(clean);
        return modifiedReturnArr;
    })
    .catch(err => {
        console.log("ERROR IN models/gameTiles",err);

    })
}

const addValueTo2DArrayJson = (arr) => {
    promises = [];
    for (let innerArr of arr) {
        promises.push(addValueToJson(innerArr));
    }
    return Promise.all(promises).then(results => {
        let returnArr = [];
        for (let ele of results) {
            returnArr.push(ele);
        }
        return returnArr;
    })
    .catch(err => {
        return Promise.resolve(err);
    })
} 

const addValueToJson = async (arr) => {
    let values = [];
    for (let tile of arr) {
        values.push( await getPointFromTileId(tile.tile_id));
    }
    return Promise.all(values).then(results => {
        let returnArr = [];
        for (let i = 0; i < arr.length; i++) {
            returnArr.push({id: arr[i].tile_id, value: results[i].value, x: arr[i].x, y: arr[i].y })
        }
        return Promise.resolve(returnArr);
    })
    .catch(err => {
        console.log("ERROR IN addValueToJson in models/gameTiles");
        return Promise.resolve(err);
    })

}

const getPointFromTileId = async (tileId) => {
    return db.one(`SELECT value FROM tiles WHERE id=$1`, [tileId])
    .catch(err => {
        console.log("ERROR IN getPointFromTileId in models/gameTiles");
        return Promise.resolve(err);
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
        playingCoordinates.push( {tile_id: Number(tile.id), x:Number((tile.x)),y: Number((tile.y))} )
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
      //  if(leftSide.length > 1) {
            tempArr = [];
            for (y of leftSide) {
                tempArr.push( y);
            }

            newTempArr = sortJsonByY(tempArr);
            returnArray.push(newTempArr);
        }
  //  }
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
        playingCoordinates.push( {tile_id: Number(tile.id) , x:Number((tile.x)),y: Number((tile.y))} )
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

    //    if (aboveSide.length > 1) {
            tempArr = [];
            for (x of aboveSide) {
                tempArr.push(x);
            }
            newTempArr = sortJsonByX(tempArr);
            returnArray.push(newTempArr);
      //  }
    }
    return returnArray;
}

const getTileDataForHTML = (gameId) => {
    var p = [];
    var tileData = [];
    var targetArr = [];
    return game.getInPlayTiles(1).then( (tileData)  => {
        ///     tile, x, y, game
        for(i = 0; i < tileData.length; i++) {
            p.push(getLetterFromTileId(tileData[i].tile_id));
        }
        return Promise.all(p)
        .then(results => {
            for(i=0; i < tileData.length; i++){
                let obj = {};
                obj["tile_id"] = tileData[i].tile_id;
                obj["x_coordinate"] = tileData[i].x_coordinate;
                obj["y_coordinate"]  = tileData[i].y_coordinate;
                obj["letter"] = results[i].letter;
                targetArr.push(obj);
            }
            return Promise.resolve(targetArr);
        })
    }).catch(err => {
        console.log(err); 
    })

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
    console.log("SORTING BY X")
    let deep_cpy = [...arr]
    let sortedInput = deep_cpy.slice().sort((a, b) => a.x - b.x);
    console.log("SORTED X INPUT IS", sortedInput)
    return sortedInput;
}

function sortJsonByY(arr){
    console.log("SORTING BY Y")
    let deep_cpy = [...arr]
    let sortedInput = deep_cpy.slice().sort((a, b) => a.y - b.y);
    console.log("SORTED Y  INPUT IS", sortedInput)
    return sortedInput;
}


async function checkValidWords(wordList){
    let valid_words = [];
    
    for ( const x of wordList ){
        console.log("CHECKING word validity of ", x)
       await gameBoard.isWordValid(x)
        .then(results => {
            if(results == true){
                console.log(x , "IS VALID WORD!")
                valid_words.push(x)
            }
       }).catch(err => {
           console.log("ERROR", err)
       })

    }
    
    console.log(valid_words)

    if(valid_words.length == wordList.length){
        console.log(" VALID MOVE ")
        return true
    }
    else{
        console.log(" INVALID WORD")
        return false
    }




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
    getTileDataForHTML,
 
    checkValidWords,
    getWordsFromArray,
    getScoreFromWords
 
 
 
}