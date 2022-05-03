const express = require("express");
const router = express.Router();
const db = require('../db');
const { getMessages, sendMessage } = require("../models/chat");

var temp;

router.get("/", async (request, response) => {
  console.log("EEEEEE");
  getMessages(1)
  .then(results => {
    console.log(results);
    temp = results;
    response.render('lobby', {
      style: 'lobbyStyle',
        messages: results
      });
  })

   
    });

module.exports = router;

