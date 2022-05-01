const game = require("../db/game");


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

module.exports = {
    getInitialBag,
    getNumTilesInBag,
    getPlayersHand,
}