var express = require('express');
var router = express.Router();
const db = require('../db');

/* LANDING PAGE . */


router.get("/", (request, response) => {
   response.render('register', {
      style: 'style'
      });
});

module.exports = router;