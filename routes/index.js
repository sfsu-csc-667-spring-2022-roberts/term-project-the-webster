var express = require('express');
const { isWordValid } = require('../models/gameBoard');
var router = express.Router();

/* LANDING PAGE . */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team Webster Scrabble' });
  // isWordValid("ab"),
  // isWordValid("ac"),
  if(req.session.user_id){
    res.redirect("/browseLobby")
  } else{
    // do nothing
  } 

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

// router.get("/lobby", (request, response) => {
//     response.render('lobby');
// });



module.exports = router;
