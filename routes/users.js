var express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
var router = express.Router();

const UserModel = require('../models/Users');



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

  // let encryptedPass = bcrypt.hash(password, 15).;
  // console.log(encryptedPass);

  // const CREATE_USER_QUERY = 
  // `INSERT INTO users ("username", "password") VALUES ($1,$2)`;
  // return db.any(CREATE_USER_QUERY,[username, password ])
  // .then ( () => {
  //   console.log("AHERE");
  //   res.redirect('/login');
  // })
  // .catch(error => {
  //   console.log("THERE");
  //   console.log(error);
  // })

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
