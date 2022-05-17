var express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
var router = express.Router();
const { removeSocket } = require('../utils/socket_store');
const UserModel = require('../models/Users');
const e = require('express');
const { emptyQuery } = require('pg-protocol/dist/messages');


router.post("/register", async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let confirmpassword = req.body['confirm-password'];

  UserModel.usernameExists(username)
    .then((userDoesExist) => {
      if (userDoesExist) {
        console.log("USER ALREADY EXISTS");
      } else {
        return UserModel.create(username, password);
      }
    })
    .then((createUserId) => {
      res.redirect('/login')
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/login", async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  let userId = -1
  if (req.session.user_id) {
    res.redirect("/lobby")
  } else {
    UserModel.authenticate(username, password)
      .then((results => {
        if (results) {
          return db.one("SELECT id FROM users WHERE username=$1;", [username])
            .then((result) => {
              userId = result.id
              return Promise.resolve(userId > 0);
            })
            .then((result) => {
              if (result) {
                req.session.user_id = userId
                res.redirect("/browseLobby")
              } else {
                res.redirect("/register")
              }
            })
        } else {
          console.log("user id was not valid.")
        }
      }))
      .catch(err => {
        console.log(err);
        console.log("failed authentication.")
        next(err);
      })
  }
});

router.post("/logout", (req, res, next) => {
  const user_id = req.session.user_id;
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      removeSocket(user_id);
      res.redirect("/")
    }
  })
})

module.exports = router;
