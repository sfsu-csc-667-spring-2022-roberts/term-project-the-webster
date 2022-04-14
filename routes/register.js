var express = require('express');
var router = express.Router();

/* LANDING PAGE . */

router.get('/', function(req, res, next) {
  res.render('register', { title: 'Team Websters Scrabble' });
});

module.exports = router;