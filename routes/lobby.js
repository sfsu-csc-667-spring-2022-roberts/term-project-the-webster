const express = require("express");
const router = express.Router();
const db = require('../db');
const session = require('express-session');
const Game = require("../db/game");

router.get("/", (request, response) => {

  if (request.session) {
    response.render('lobby', {
      style: 'lobbyStyle',
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
        Game.getGameUsers2(gameID)
          .then((gameUsers) => {
            for (i = 0; i < gameUsers.length; i++) {
              if (gameUsers[i].user_id == userID) {
                response.redirect('/browseLobby');
                return;
              }
            }
            var highestOrder = 0;
            for (i = 0; i < gameUsers.length; i++) {
              highestOrder = Math.max(highestOrder, gameUsers[i].order);
            }
            Game.joinGame(gameID, userID)
              .then(() => {
                Game.updateGameUserOrder(gameID, userID, highestOrder + 1)
                  .then(() => {
                    Game.getGameUsers2(gameID)
                      .then((gameUsers) => {
                        response.render('lobby', {
                          style: 'lobbyStyle',
                          players: gameUsers,
                          currUser: userID,
                          gameId: gameID
                        })
                      })
                  })
              })
          })
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
})

module.exports = router;

