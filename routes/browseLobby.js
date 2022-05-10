const e = require("express");
const express = require("express");
const router = express.Router();
const db = require('../db');

//temp import, will need to be encapsulated into models/gameboard
const Game = require("../db/game");

router.get("/", (request, response) => {
    Game.getGames().then((games) => {
        /*games.forEach(function () {
            Game.getGameUsers(games.request.id).then() 
        })*/
        // Game.getGameUsers(games)
        // console.log(games);
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
