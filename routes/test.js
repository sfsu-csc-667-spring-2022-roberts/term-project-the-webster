const express = require("express");
const router = express.Router();
const db = require("../db");
const game = require("../db/game");
const gameTiles = require("../models/gameTiles");
const gameScore = require("../models/scoreBoard");



router.get("/", (request, response) => {

    // gameTiles.getInitialHand(4,4).then((res) => {
    //     console.log("res: " + res);
    // }).catch((err) => {
    //     console.log(err);
    // });
    // game.getGameUsers2(22).then(results=> {
    //     console.log(results); 
    // }).catch(err => {
    //     console.log(err); 
    // })
    let test =[];
    gameScore.getPlayersScore(22).then((scores=> {
        test = scores;
        console.log("in Test", test)
    }));
    console.log("in Test", test)
        

  
  
})

module.exports = router;
