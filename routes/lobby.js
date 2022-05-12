const express = require("express");
const router = express.Router();
const db = require('../db');
const session = require('express-session');



router.get("/", (request, response) => {
  
  console.log("inside of lobby page ")

  if(request.session){
    console.log("valid session")
    console.log(request.sessionID)
    console.log(request.session.user_id)
    response.render('lobby', {
      style: 'lobbyStyle',
        // messages: results
      });
  }else{
    response.send("no session found :(")
  }
   
  
   
    });

module.exports = router;

