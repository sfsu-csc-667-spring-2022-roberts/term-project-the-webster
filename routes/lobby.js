const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
   
    // response.send("lobby page!")
    response.render('lobby', {title: 'lobby'});
   
});

module.exports = router;