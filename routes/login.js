const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
   //   res.render('index', { title: 'Team Websters Scrabble' });
    response.render('login', { title: 'login  ' , block: 'hey hey hey ' });
    
});

module.exports = router;