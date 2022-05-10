const game = require("../db/game");
const db = require("../db");


const getInitialBag = () => {
    //might require getting a game Id first 
}

const getNumTilesInBag = () => {
    return 100;
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
        return Promise.resolve(err);
    })
}



module.exports = {
    getInitialBag,
    getNumTilesInBag,
    getPlayersHand,
    getLetterWorth
}