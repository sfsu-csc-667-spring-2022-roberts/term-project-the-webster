var express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
var router = express.Router();

const UserModel = require('../models/Users');


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
  console.log("HERE");

  UserModel.create(username, password)
  .then(results => {
    res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
    next(err);
  })


});

module.exports = router;
