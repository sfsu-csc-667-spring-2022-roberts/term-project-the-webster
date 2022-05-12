const express = require("express");
const router = express.Router();
const db = require('../db');




console.log(socket);

router.get("/", (request, response) => {

     
     response.render('login', {
        style: 'style' , 
        block: '', 
        });

        let fix = 
     response.render("login", {
        style: "style",
});

    
});

module.exports = router;