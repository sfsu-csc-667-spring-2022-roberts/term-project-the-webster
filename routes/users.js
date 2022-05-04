var express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
var router = express.Router();

const UserModel = require('../models/Users');
const e = require('express');
const { emptyQuery } = require('pg-protocol/dist/messages');



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
  console.log(req.session)
 
  let userId = -1
  if(req.session.user_id){
    res.redirect("/lobby")
  }else{
  
  UserModel.authenticate(username, password)
   .then((results => {
    
    if(results){
    
     return db.one("SELECT id FROM users WHERE username=$1;", [username])
     .then((result) =>
     {

      
      userId = result.id
      return Promise.resolve(userId > 0);

     })
     .then((result) => {
      console.log("user exists? =>  " + result)
      // user id is valid in db. 
       if(result){
         /**  storing userId in cookie. */
        
          req.session.user_id = userId
         
         res.redirect("/lobby")
       }else{
         
         res.redirect("/register")
       }
     })
    
    }else{
      console.log("user id was not valid.")
    }
   
   
   

    // db.one('INSERT INTO sessions (user_id, session_id) VALUES ($1,$2) RETURNING session_id AS "id;"', [userId, _session_id])
    // .then(({id}) => {
    //   console.log("inserting into sessions ")
    //   console.log(id)
    // })

     // ##session


  }))
  .catch(err => {
    console.log(err);
    console.log("failed authentication.")
    next(err);
  })
  
  }

});

router.post("/logout",(req, res, next)=> {
  
  
  req.session.destroy((err) => {
    if(err){
      next(err)
    }else{
      res.redirect("/")
    }
  })
})


module.exports = router;
