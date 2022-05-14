const express = require("express");
const io = require('../socket/index')
const router = express.Router();
//temp import, will need to be encapsulated into models/gameboard
const game = require("../db/game");
//models imports
const gameBoard = require("../models/gameBoard");
const scoreBoard = require("../models/scoreBoard");
const chat = require("../models/chat");

const gameTiles = require("../models/gameTiles");
const session = require("express-session");
// const frontend = require("../public/javascript/frontend")

const gameTilesModel = require("../models/gameTiles");


router.get("/create", (request, response) => {

  // let currentUser = 1; // don't hard code this, get from params
  if (request.session) {
    
    let currentUser = request.session.user_id;
    console.log("current user is ", currentUser);
    game.createGame(currentUser)
    .then((game_id) => {
      // do socket thingy
      response.redirect(`/lobby/${game_id}`);
    })
  } else {
    console.log("no sesson in create");
  }
  
  


  /*game.createGame(currentUser)
      .then((game_id) => {
        console.log("gameId:" + game_id);

        response.redirect(`/game/${game_id}`);
      })*/

  //     .catch((error) => {
  //       console.log(error);
  //       response.redirect("/lobby");
  //     });
  // } else {
  //   console.log("HANDLE THIS ERROR WHERE USER_ID DOES NOT EXIST IN game.js");
 
  // }
  // });
// =======
//   // let currentUser = 1; // don't hard code this, get from params\
//   if(request.session) {
//     let currentUser = request.session.user_id;
//     console.log("current user is ", currentUser);
//     game.createGame(currentUser)
//     .then((game_id ) => {
//       console.log("gameId:" + game_id);
//       response.redirect(`/lobby/${game_id}`);
//     })
//     .catch((error) => {
//       console.log(error);
//       response.redirect("/browseLobby");
//     });
//   } else {
//     console.log("HANDLE THIS ERROR WHERE USER_ID DOES NOT EXIST IN game.js")
//   }
// >>>>>>> development
});

router.get("/:id", (request, response) => {
  //window.location.pathname
  let id = request.params;
  if(request.session){
    var userId = request.session.user_id;
    var gameId = request.params.id;
  } //HANDLE POTENTIAL ERROR FROM NO SESSION 
  let gameTiles = [];
  let playerHand = [];
  console.log( "in game route ",scoreBoard.getPlayers(id.id));
  game.getEmptyGrid()
    .then((cells) => {
      gameTilesModel.parsePlayerHandForHTML(gameId,userId)
      .then(playerTiles => {
        playerHand = playerTiles;
        console.log(` PLAYER HAND = ${playerHand}`)
      })
      .then(useless => {
        response.render("game", {
            style: "gameStyle", 
            boardSquares: cells,
            //tiles: playerHand,
            tiles: playerHand,
            tilesInBag: gameTiles.getNumTilesInBag,
            messages: chat.getMessages(),
            //isReady: true,
            //broken call 
            //players: scoreBoard.getPlayers(id.id),
            });
      });
    
      Promise.resolve(1);
    })
    .catch((error) => {
      Promise.reject(error);
    });
});

router.get("/:id/join", (request, response) => {
  console.log("join  ",request.params.id);
  if (request.session) {
    let userId = request.session.user_id;
    var gameId = request.params.id;

    game.joinGame(gameId, userId)
    .then(() => {
      response.redirect(`/game/${gameId}`);
      // Broadcast to game socket that a user has joind the game
    })
    .catch((error) => {
      console.log(error);
      response.redirect("/browseLobby");
    });
  }
  else {
    console.log("NO SESSION DETECTED IN JOIN")

  }
});

router.post("/:id/playWord", (request, response) => {

  const { id } = request.params;
  const  wordData  = request.body;
  let word_placed;
  console.log(request.body)
 
  console.log(`HANDLE THIS WORD IN GAME ${id}`);
  // console.log( {wordData} )

    const res_wordData  = { wordData }

    const tiles = res_wordData["wordData"]
    wordifyTiles(tiles).then(result => {
        word_placed = result.toLowerCase()

        gameBoard.isWordValid(word_placed)
        .then(result => {
          console.log("IS WORD VALID ? " + result)
          if(result == true){
            getPointsPerWord(tiles)
            .then(result => {
              console.log(word_placed + " is worth " +  result + " points.")
            }).catch(err => {
              console.log("ERR " + err)
            })
          }
        }).catch(err => {
          console.log("ERROR " + err)
        })

    }).catch(err => {
      console.log("ERROR!! " + err)
    })
    //makeTilesInPlay(tiles, id);

  response
  .status(200)
  .json(res_wordData);
});
// });

async function wordifyTiles(tiles){
  let word = "";
  for( const x of tiles){
    word+=String(x.letter)
  }

  return word;
}

async function getPointsPerWord(tiles){
  let points = 0;
  for ( const x of tiles){
    points+=Number(x.value)
  }
  return points;
}

async function makeTilesInPlay(tiles, gameId) {
  let promises = [];
        for (i=0; i < tiles.length; i++) {
          promises.push(game.placeTile(tiles[i].id, tiles[i].x, tiles[i].y, gameId));
        }
        // placeTile = (tile_id, x, y, game_id)
        return Promise.all(promises)
        .then(results => {
          if(results){return Promise.resolve(true)}
        }).catch(err =>{
          console.log(err);
        })
}


module.exports = router;
