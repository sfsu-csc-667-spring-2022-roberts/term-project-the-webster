const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
    response.render('browseLobby', { title: 'browse  ' , 
    block: '' });
    // response.send("lobby page!")   
});


module.exports = router;
