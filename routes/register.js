const express = require('express');
const router = express.Router();
const db = require('../db');

/* LANDING PAGE . */

router.get("/", (request, response) => {
   response.render('register', {
      style: 'style'
   });
});

module.exports = router;