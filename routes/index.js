var express = require('express');
const { isWordValid } = require('../models/gameBoard');
var router = express.Router();
const db = require("../db/index");

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

router.get('/userInfo', async function (req, res){
  
  if(req.session.user_id){
   const user_id = req.session.user_id;
  
  let query = 'SELECT username FROM users WHERE id = $1';
	 await db.one(query, [user_id]).then(result => {
   
    res 
    .status(200)
		.json({ uid: user_id, username: result.username });
  });


   
  }
  
  else{
    console.log("SORRY CAN'T FIND THIS USER, NOT VALID SESSION DATA! ")
  }
	
})

module.exports = router;
