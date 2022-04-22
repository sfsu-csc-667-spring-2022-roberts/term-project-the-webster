const express = require("express");

const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
    let squares = [];                        
    const doubleLetter = new Set();
    //building doubleLetter set 
    {
    doubleLetter.add("0,3");
    doubleLetter.add("0,11");
    doubleLetter.add("2,6");
    doubleLetter.add("2,8");
    doubleLetter.add("3,0");
    doubleLetter.add("3,7");
    doubleLetter.add("3,14");
    doubleLetter.add("6,2");
    doubleLetter.add("6,6");
    doubleLetter.add("6,8");
    doubleLetter.add("6,12");
    doubleLetter.add("7,3");
    doubleLetter.add("7,11");
    doubleLetter.add("8,2");
    doubleLetter.add("8,6");
    doubleLetter.add("8,8");
    doubleLetter.add("8,12");
    doubleLetter.add("11,0");
    doubleLetter.add("11,7");
    doubleLetter.add("11,14");
    doubleLetter.add("12,6");
    doubleLetter.add("12,8");
    doubleLetter.add("14,3");
    doubleLetter.add("14,11");
    }
    const doubleWord = new Set();
    //building doubleWord set 
    {
    doubleWord.add("1,1");
    doubleWord.add("1,13");
    doubleWord.add("2,2");
    doubleWord.add("2,12");
    doubleWord.add("3,3");
    doubleWord.add("3,11");
    doubleWord.add("4,4");
    doubleWord.add("4,10");
    doubleWord.add("10,4");
    doubleWord.add("10,10");
    doubleWord.add("11,3");
    doubleWord.add("11,11");
    doubleWord.add("12,12");
    doubleWord.add("12,2");
    doubleWord.add("13,1");
    doubleWord.add("13,13");
    }
    const tripleLetter = new Set();
    {
    tripleLetter.add("1,5");
    tripleLetter.add("1,9");
    tripleLetter.add("5,1");
    tripleLetter.add("5,5");
    tripleLetter.add("5,9");
    tripleLetter.add("5,13");
    tripleLetter.add("9,1");
    tripleLetter.add("9,5");
    tripleLetter.add("9,9");
    tripleLetter.add("9,13");
    tripleLetter.add("13,5");
    tripleLetter.add("13,9");  
    }
    const tripleWord = new Set();
    {
    tripleWord.add("0,0");
    tripleWord.add("0,7");
    tripleWord.add("0,14");
    tripleWord.add("7,0");
    tripleWord.add("7,14");
    tripleWord.add("14,0");
    tripleWord.add("14,7");
    tripleWord.add("14,14");
    }
    let center = new Set();
    center.add("7,7");

    for (let xPos = 0; xPos < 15; xPos++){
        for (let yPos = 0;  yPos < 15; yPos++){
            
            if (doubleLetter.has(`${xPos},${yPos}`) ) {
                squares.push({x:xPos, y:yPos, type:"double-letter", text:"L-x2"});
            }
            else if(doubleWord.has(`${xPos},${yPos}`) ) {
                squares.push({x:xPos, y:yPos, type:"double-word", text:"W-x2"}); 
            }else if(tripleLetter.has(`${xPos},${yPos}`) ) {
                squares.push({x:xPos, y:yPos, type:"triple-letter", text:"L-x3"});
            }else if(tripleWord.has(`${xPos},${yPos}`) ) {
                squares.push({x:xPos, y:yPos, type:"triple-word", text:"W-x3"});
            }else if(center.has(`${xPos},${yPos}`) ) {
                squares.push({x:xPos, y:yPos, type:"center", text:"*"});
            }
            else{
                squares.push({x:xPos, y:yPos, type:"single"});
            }
        }
    }
    let gameTiles = [{letter:"A", value:1}, {letter:"B", value:1},{letter:"C", value:1},
    {letter:"D", value:1},{letter:"E", value:1},{letter:"F", value:1},{letter:"G", value:1}]
    response.render('game', {title: 'Scrabble', boardSquares: squares, tiles:gameTiles })
});

module.exports = router;

