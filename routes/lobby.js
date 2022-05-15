const express = require("express");
const router = express.Router();
const db = require('../db');
const session = require('express-session');

 
const Game = require("../db/game");
 

router.get("/", (request, response) => {

  console.log("inside of lobby page ")

  if (request.session) {
    response.render('lobby', {
      style: 'lobbyStyle',
      // messages: results
    });
  } else {
    response.send("no session found :(")
  }
});

router.get("/:id", (request, response) => {
  let gameID = request.params.id;
  let userID = request.session.user_id; 
  
  console.log("inside lobby / id router ")
  
  Game.getGameById(gameID)
  .then((game) => {
    let inLobby = game.in_lobby;
    if (inLobby == true) {
      Game.getGameUsers2(gameID)
      .then((gameUsers) => {
        for (i = 0; i < gameUsers.length; i++) {
          if (gameUsers[i].user_id == userID) {
            console.log("user already exists, so redirecting to browseLobby");
            response.redirect('/browseLobby');
            return;
          }
        }
        Game.joinGame(gameID, userID)
        .then(() => {
          console.log(`inserting ${userID} into game`);
          Game.getGameUsers2(gameID)
          .then((gameUsers) => {
            console.log("getting gameUsers2 for a 2nd and final time before rendering...")
            response.render('lobby', {
              style: 'lobbyStyle',
              players: gameUsers,
              currUser: userID,
              gameId: gameID
            })
          })
        })
      })
    }
  })
})

/*router.get("/:id", (request, response) => {
  let gameID = request.params.id;
  let userID = request.session.user_id;
  Game.getGameById(gameID)
    .then((game) => {
      let inLobby = game.in_lobby;
      if (inLobby == true) {
        Game.joinGame(gameID, userID)
          .then(() => {
            Game.getGameUsers2(gameID)

              .then((gameUsers) => {
                response.render('lobby', {
                  style: 'lobbyStyle',
                  players: gameUsers,
                  currUSer: userID,
                  gameId: gameID
                });
              })
          })
      } else {
        response.redirect('/browseLobby');
      }
    })
})*/

router.get("/leave/:id", (request, response) => {
  if (request.session) {
      let userId = request.session.user_id;
      let gameId = request.params.id;
      Game.removeFromLobby(gameId, userId)
      .then(() => {
          response.redirect("/browseLobby");
      })
  } else {
      console.log("NO SESSION");
  }
  // Game.removeFromLobby(request.session.id)
})

module.exports = router;

