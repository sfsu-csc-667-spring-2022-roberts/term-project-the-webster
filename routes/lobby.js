const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
    response.render('', {title: 'lobby'});
   
});

module.exports = router;