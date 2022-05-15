const express = require("express");
const router = express.Router();
const db = require("../db");
const game = require("../db/game");
const gameTiles = require("../models/gameTiles");
const gameScore = require("../models/scoreBoard");



router.get("/", (request, response) => {


    gameTiles.getInitialHand(2,1);
    // playedCoords = [ {tile_id: 11, x: '6',y:'6' },{tile_id: 13,x: '6',y:'8' } , {tile_id: 15,x: '6',y:'9' } , {tile_id: 4, x: '6',y:'10' }  ]


    // gameTiles.getScoreFromWords(["hello", "world", "beans"])
    // .then(results => {
    //     console.log("SCORE TO ADD IS", results);
    // })
    // gameTiles.getWords(playedCoords, 1)
    // .then(results => {
    //     if(results != undefined)
    //     {
    //         // console.log(results);
    //         gameTiles.getWordsFromArray(results)
    //         .then(resut => {
    //             console.log(resut);
    //         });
    //     }
    // })
  
})

module.exports = router;
