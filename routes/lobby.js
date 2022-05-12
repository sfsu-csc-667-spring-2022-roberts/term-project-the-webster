const express = require("express");
const router = express.Router();
const db = require('../db');
const session = require('express-session');

 
const Game = require("../db/game");
 

router.get("/", (request, response) => {

  console.log("inside of lobby page ")

  if (request.session) {
    console.log("valid session")
    console.log(request.sessionID)
    console.log(request.session.user_id)
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
})

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
  Game.removeFromLobby(request.session.id)
})

module.exports = router;

