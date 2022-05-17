const e = require("express");
const express = require("express");
const router = express.Router();
const db = require('../db');
const Game = require("../db/game");

router.get("/", (request, response) => {
    Game.getGames().then((games) => {
        response.render('browseLobby', {
            style: 'style',
            lobbies: games
        });
    })
        .catch((err) => Promise.reject(err));
});

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
