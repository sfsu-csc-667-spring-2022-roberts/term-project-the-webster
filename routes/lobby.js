const express = require("express");
const router = express.Router();
const db = require('../db');
const session = require('express-session');

const Game = require("../db/game");

router.get("/", (request, response) => {

  console.log("inside of lobby page ")

  if (request.session) {
    console.log("valid session")
    response.render('lobby', {
      style: 'lobbyStyle',
      // messages: results
    });
  } else {
    response.send("no session found :(")
  }
});

router.get("/:id", (request, response) => {
  let gameId = request.params.id;
  console.log("in id lobby");
  console.log("gameId: " + gameId);
  Game.getGameById(gameId)
    .then((game) => {
      console.log("game");
      console.log(game);
      console.log("in_lobby: " + game.in_lobby)
      let inLobby = game.in_lobby;
      console.log(inLobby == true)
      if (inLobby == true) {
        response.render('lobby', {
          style: 'lobbyStyle'
          // also send data here about players etc
        });
      } else {
        response.redirect('/browseLobby');
      }
    })
})

module.exports = router;

