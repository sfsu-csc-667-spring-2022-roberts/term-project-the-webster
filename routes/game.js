const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
   
    response.render('layout', {title: 'Scrabble',
block: ' play game '})
});

module.exports = router;

