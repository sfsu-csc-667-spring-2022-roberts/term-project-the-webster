var express = require('express');
var router = express.Router();

/* LANDING PAGE . */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team Webster Scrabble' });
});

router.get("/register", (request, response) => {
  response.render('register');
});

router.get("/login", (request, response) => {
  response.render('login');
});

router.get("/game", (request, response) => {
  response.render('game');
});

router.get("/lobby", (request, response) => {
  response.render('lobby');
});

module.exports = router;
