const express = require("express");
const router = express.Router();
const db = require('../db');

//temp import, will need to be encapsulated into models/gameboard
const Game = require("../db/game");

router.get("/", (request, response) => {
    console.log("games");
    Game.getGames().then((games) => {
        console.log(games);
        response.render('browseLobby', {
            style: 'style',
            lobbies: games
        });
    })
    /*.then((games) => {
        console.log(games);
        response.render('browseLobby', {
            style: 'style',
            lobbies: games
        });
    });*/
    /*response.render('browseLobby', {
        style: 'style',
        // lobbies: games
    });*/
});

module.exports = router;
