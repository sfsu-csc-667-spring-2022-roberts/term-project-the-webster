var express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
var router = express.Router();

const UserModel = require('../models/Users');
const e = require('express');


//TODO verify if username already in DB
router.post("/register", async (req, res, next)=> {
  let username = req.body.username;
  let password = req.body.password;
  let confirmpassword = req.body['confirm-password'];

  if (password != confirmpassword)
  {
    //TODO make this not insert to DB if it does not match
    console.log("passwords do not match");
  }
  console.log("REGISTER IS RUNNING");

  UserModel.usernameExists(username)
  .then( (userDoesExist) => {
    if(userDoesExist) {
      console.log("USER EXISTS");
    }
    else {
      console.log("USER DOES NOT EXISTSS");
      return UserModel.create(username, password);
    }
  })
  .then((createUserId) => {
    //TODO make this get from the create query
    console.log("AHHHH");
    res.redirect('/login')
  })
  .catch(err =>{
    console.log(err);
  });
});

router.post("/login", async (req, res, next)=> {
  let username = req.body.username;
  let password = req.body.password;
  console.log("LOGIN IS RUNNING");
  console.log(username);
  console.log(password);

  UserModel.authenticate(username, password)
  .then(results => {
    res.redirect('/lobby');
  })
  .catch(err => {
    console.log(err);
    next(err);
  })
});

module.exports = router;
