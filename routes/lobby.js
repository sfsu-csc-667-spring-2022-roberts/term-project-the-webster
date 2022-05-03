const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
    response.render('lobby', {
      style: 'lobbyStyle',
        messages: [
          {
            id: 1,
            timestamp: " 21:03",
            content: 'hello',
          },
          {
            id: 2,
            timestamp: ` 21:05 `,
            content: "hey",
          },
          {
            id: 3,
            timestamp: `21:05 `,
            content: "yo",
          },
          {
            id: 4,
            timestamp: `21:05 `,
            content: "I'm a shooting star leaping through the sky Like a tiger defying the" +
            " laws of gravity I'm a racing car passing by like Lady Godiva I'm gonna go go go" +
            "There's no stopping me :)",
          }
        ]
      });
   
    });

module.exports = router;

