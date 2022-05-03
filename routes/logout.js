const express = require("express");
const router = express.Router();
const db = require('../db');





router.get("/", (request, response) => {

    //  request.session.destroy((err) => {
    //     if(err){
    //       next(err)
    //     }else{
    //       console.log("session destroyed.")
    //       res.redirect("/")
    //     }
    //   })
    res.send(request.session.user_id)
     


});

module.exports = router;