const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
    response.render('browseLobby', {
        style: 'style',
    });
});

module.exports = router;
