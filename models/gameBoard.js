const game = require("../db/game");
const fs = require('fs')
var parse = require('csv-parse')

const path = "db/scrabble_dictionary.csv"
var dataArray;
fs.readFile(path, 'utf8', function (err, data) {
    dataArray = data.split(/\r?\n/);
  })

const isWordValid = (word) => {
    console.log("path: " + path);
    var test = dataArray.includes(word);
    console.log(word + " : " + test);
    return test;
};


const getEmptyGameBoard = async () => {
    //totally broken
    let emptyBoard = await game.getEmptyGrid();
    console.log( "models -> " + emptyBoard);
    return emptyBoard;
}

module.exports = {
    getEmptyGameBoard,
    isWordValid
};