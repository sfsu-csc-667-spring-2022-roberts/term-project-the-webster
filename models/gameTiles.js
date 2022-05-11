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

const getPlayersHand = (playerID) => {
    
    let gameTiles =[{letter:"A", value:1, order:1}, 
                    {letter:"B", value:1, order:2},
                    {letter:"C", value:1, order:3},
                    {letter:"D", value:1, order:4}, 
                    {letter:"E", value:1, order:5},
                    {letter:"F", value:1, order:6},
                    {letter:"G", value:1, order:7}];
    return gameTiles;
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
        return Promise.reject(err);
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
    let letterList = [];
    let valueList = [];
    let posList = []; 
    //let letter;
    
    game.getPlayerHand(gameId, userId)
    .then(handData => {
      for(i = 0; i < handData.length; i++ ){
          getLetterFromTileId(handData[i].tile_id)
          .then(letter =>{
              console.log("lettertest ,", letter.letter)
              letterList.push(letter.letter);
          }).then(results =>{
            getLetterWorth(letterList[i])
            .then(value =>{
                valueList.push(value);
            })
            .then(pauseForTest => {
                console.log(valueList);
            })
          }).catch(err => {
            console.log(err);
          })
          
      }
      
    //   for(i = 0; i < handData.length; i++ ){
    //     getLetterWorth(letterList[i])
    //     .then(value =>{
    //        // console.log("value in promise", value.value)
    //         valueList.push(value);
    //     }).catch(err => {
    //       console.log(err);
    //     })
    // }
    })
  
  }

module.exports = {
    getInitialBag,
    getNumTilesInBag,
    getPlayersHand,
    getLetterWorth,
    getInitialHand,
    getLetterFromTileId,
    getCoordinatesFromTileId,
    parsePlayerHandForHTML,
}