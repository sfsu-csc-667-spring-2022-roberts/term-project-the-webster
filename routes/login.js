const express = require("express");
const router = express.Router();
const db = require('../db');





router.get("/", (request, response) => {
        let fix = 
     response.render("login", {
        style: "style",
});
    
});

module.exports = router;