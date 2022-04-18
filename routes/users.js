var express = require('express');
var router = express.Router();

const UserModel = require('../models/Users');


router.post("/register", (req, res, next)=> {
  let username = req.body.username;
  let password = req.body.password;
  let confirmpassword = req.body['confirm-password'];

  if (password != confirmpassword)
  {
    //TODO make this not insert to DB if it does not match
    console.log("passwords do not match");
  }

  UserModel.create(username, password)
  .then((createdUserId) => 
  {
    if (createdUserId > 0)
    {
      console.log("SUCCESS");
      res.redirect('/login');
    }
  })
  .catch((err) =>
  {
    console.log(err);
  })

});

module.exports = router;
