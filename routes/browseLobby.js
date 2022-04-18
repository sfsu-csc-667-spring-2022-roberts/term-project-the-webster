const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
    response.render('browseLobby', {
        title: 'browse',
        lobbies: [
            {
                id: 1,
                name: "Test Lobby",
                host: "Bob Jones",
                players: 4
            },
            {
                id: 2,
                name: "Come play Scrabble",
                host: "Damon",
                players: 2
            },
            {
                id: 3,
                name: "Fun times",
                host: "Johnson",
                players: 3
            }
        ]
    });
});


module.exports = router;
