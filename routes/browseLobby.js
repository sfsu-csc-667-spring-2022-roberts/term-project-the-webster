const express = require("express");
const router = express.Router();
const db = require('../db');

//temp import, will need to be encapsulated into models/gameboard
const Game = require("../db/game");

router.get("/", (request, response) => {
    var gamesData = new Array();
    console.log("games");
    /*Game.getAllGameInfo().then((info) => {
        console.log("info:");
        console.log(info);
        info.forEach(function(){
            gamesData.add({
                game_id: info.game_id,
                in_lobby: info.in_lobby,

            })
        })
        gamesData.add({

        })
    })*/
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
