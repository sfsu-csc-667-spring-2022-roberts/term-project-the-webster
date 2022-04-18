var express = require('express');
var router = express.Router();


router.post("/register", (req, res, next)=> {
  console.log("EEEE0");
  let username = req.body.username;
  let password = req.body.password;
  console.log("username is:" + username, "password is:" + password);

});

module.exports = router;
