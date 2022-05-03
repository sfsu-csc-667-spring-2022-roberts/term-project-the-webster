const game = require("../db/game");

const isWordValid = () => {
    return true;
};


const getEmptyGameBoard = async () => {
    //totally broken
    let emptyBoard = await game.getEmptyGrid();
    console.log( "models -> " + emptyBoard);
    return emptyBoard;
}

module.exports = {
    getEmptyGameBoard,
};
