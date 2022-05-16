const express = require("express");
const router = express.Router();
const db = require("../db");
const game = require("../db/game");
const gameTiles = require("../models/gameTiles");
const gameScore = require("../models/scoreBoard");



router.get("/", (request, response) => {

// <<<<<<< feature_update_board
//     // gameTiles.getInitialHand(4,4).then((res) => {
//     //     console.log("res: " + res);
//     // }).catch((err) => {
//     //     console.log(err);
//     // });
//     // game.getGameUsers2(22).then(results=> {
//     //     console.log(results); 
//     // }).catch(err => {
//     //     console.log(err); 
//     // })
//     // let test =[];
//     // gameScore.getPlayersScore(22).then((scores => {
//     //     test = scores;
//     //     console.log("in Test", test)
//     // }));
//     // console.log("in Test", test)
//     var p = [];
//     var letters = [];
//     var tileData = [];
//     var targetArr = [];
//     game.getInPlayTiles(1).then( (tileData)  => {
//         ///     tile, x, y, game
//         for(i = 0; i < tileData.length; i++) {
//             console.log(tileData[i].tile_id);
//             p.push(gameTiles.getLetterFromTileId(tileData[i].tile_id));
//         }
//         return Promise.all(p)
//         .then(results => {
//             for(i=0; i < tileData.length; i++){
//                 let obj = {};
//                 obj["tile_id"] = tileData[i].tile_id;
//                 obj["x_coordinate"] = tileData[i].x_coordinate;
//                 obj["y_coordinate"]  = tileData[i].y_coordinate;
//                 obj["letter"] = results[i].letter;
//                 targetArr.push(obj);
//             }
//             console.log(targetArr);
//         })
//     }).catch(err => {
//         console.log(err); 
//     })
// =======
// >>>>>>> development

   // gameTiles.getInitialHand(2,4);
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
