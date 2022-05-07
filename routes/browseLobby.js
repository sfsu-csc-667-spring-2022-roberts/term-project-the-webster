const express = require("express");
const router = express.Router();
const db = require('../db');

//temp import, will need to be encapsulated into models/gameboard
const Game = require("../db/game");

router.get("/", (request, response) => {
    Game.getGames().then((games) => {
        games.forEach(function () {
            Game.getGameUsers(games.id)
        })
        Game.getGameUsers(games)
        console.log(games);
        response.render('browseLobby', {
            style: 'style',
            lobbies: games
        });
    })
});

module.exports = router;
