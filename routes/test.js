const express = require("express");

//const { response } = require("../app");

const router = express.Router();
const db = require("../db");
const game = require("../db/game");
const gameTiles = require("../models/gameTiles");



router.get("/", (request, response) => {

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

  gameTiles.getInitialHand(1,1)
  .then(results => console.log(results));

  // db.any(`INSERT INTO users ("username", "password") VALUES ($1,$2)`,[name, pass] )
  //         .then(_ =>
  //         db.any(`SELECT * FROM users`))
  //         .then(results => response.json(results))
  //         .catch(error => {
  //             console.log(error)
  //             response.json({ error })
  //         })

    // test = gameTiles.parsePlayerHandForHTML(1,1)
    // .then(result => {
    //     console.log(" in promise of test.js ---> ", result);
    // })
    // .catch((err) => {
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
