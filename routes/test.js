const express = require("express");
const router = express.Router();
const db = require("../db");
const game = require("../db/game");
const gameTiles = require("../models/gameTiles");
const gameScore = require("../models/scoreBoard");



router.get("/", (request, response) => {


// <<<<<<< socket_rooms
    gameTiles.getInitialHand(3,1).then((res) => {
        console.log("res: " + res);
    }).catch((err) => {
        console.log(err);
    })
// =======
//     gameScore.getMultiplier(7,7)
//     .then(results => {
//         console.log("TEST" ,results)
// >>>>>>> development
//     })
    // gameScore.getPlayersScore(1,1).then(results => {
    //     console.log("PLAYER SCORE BEFORE UPDATE ", results)
    // })

    // console.log("ASFSAFSA");
    // gameScore.updatePlayerScore(1,1,100)
    // .then(results => {
    //     gameScore.getPlayersScore(1,1)
    //     .then(results => {
    //         console.log("playe score is", results);
    //     })
    // })
    // game.incrementGameTurn(1)
    // .then(results => {
    //     game.getGameTurn(1)
    //     .then(results => {
    //         console.log("Game Turn",results);
    //     })
    // })

    // game.updateGameUserOrder(1,1,1)
    // .then(blah => {
    //     // console.log(blah);
    //     game.updateGameUserOrder(1,2,2)
    //     .then(blah => {
    //         // console.log(blah);
    //         userorder = [];
    //         for (i =1; i <= 2; i++ ) {
    //             userorder.push(game.getGameUserOrder(1,i));
    //         }
    //         Promise.all(userorder).then(results => {
    //             console.log("user order is ", results);
    //         })
    //     })
    // })
    // game.getGameState(1).then(results =>{
    //     console.log(results);
    // })

    // gameTiles.getInitialHand(1,1).then((res) => {
    //     console.log("res: " + res);
    // }).catch((err) => {
    //     console.log(err);
    // })

    //     db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at $
    // {Date.now()}')`)
    //         .then(_ => db.any(`SELECT * FROM test_table`))
    //         .then(results => response.json(results))
    //         .catch(error => {
    //             console.log(error)
    //             response.json({ error })
    //         })
    // });
    // let name = 'wat';
    // let pass = 'watt'

    // game.getPlayerHand(1,1)
    // .then(results => {
    //     console.log("PLAYER HAND:", results);
    // });

    // // game.placeTile(5,1,1,1);

    // console.log(game.getInPlayTiles(1));

    // game.getInPlayTiles(1)
    // .then(results => console.log(results));

    /*gameTiles.getLetterWorth('')
    .then(result => {
        console.log("letter worth is ", result);
        console.log("BANANA");
    })
    .catch((err) => {
        console.log(err);
    })*/


    // db.any(`INSERT INTO users ("username", "password") VALUES ($1,$2)`,[name, pass] )
    //         .then(_ => 
    //         db.any(`SELECT * FROM users`))
    //         .then(results => response.json(results))
    //         .catch(error => {
    //             console.log(error)
    //             response.json({ error })
    //         })
  //     db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at $
  // {Date.now()}')`)
  //         .then(_ => db.any(`SELECT * FROM test_table`))
  //         .then(results => response.json(results))
  //         .catch(error => {
  //             console.log(error)
  //             response.json({ error })
  //         })
  // });
  // let name = 'wat';
  // let pass = 'watt'

  // game.getPlayerHand(1,1)
  // .then(results => {
  //     console.log("PLAYER HAND:", results);
  // });

  // // game.placeTile(5,1,1,1);

  // console.log(game.getInPlayTiles(1));
 

  // db.any(`INSERT INTO users ("username", "password") VALUES ($1,$2)`,[name, pass] )
  //         .then(_ =>
  //         db.any(`SELECT * FROM users`))
  //         .then(results => response.json(results))
  //         .catch(error => {
  //             console.log(error)
  //             response.json({ error })
  //         })
 
    
//     db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at $
// {Date.now()}')`)
//         .then(_ => db.any(`SELECT * FROM test_table`))
//         .then(results => response.json(results))
//         .catch(error => {
//             console.log(error)
//             response.json({ error })
//         })
// });
// let name = 'wat';
// let pass = 'watt'

// game.getPlayerHand(1,1)
// .then(results => {
//     console.log("PLAYER HAND:", results);
// });

// // game.placeTile(5,1,1,1);

// console.log(game.getInPlayTiles(1));

// game.getInPlayTiles(67)
// .then(results => console.log(results));

// gameTiles.getLetterFromTileId(91)
// .then(result => {
//     console.log("letter worth is ", result);
//     console.log("BANANA");
// })
// .catch((err) => {
//     console.log(err);
// })


// db.any(`INSERT INTO users ("username", "password") VALUES ($1,$2)`,[name, pass] )
//         .then(_ => 
//         db.any(`SELECT * FROM users`))
//         .then(results => response.json(results))
//         .catch(error => {
//             console.log(error)
//             response.json({ error })
//         })
});
module.exports = router;
