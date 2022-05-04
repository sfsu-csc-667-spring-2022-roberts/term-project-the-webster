const express = require("express");
const router = express.Router();
const db = require('../db');





router.get("/", (request, response) => {

   
    res.send(request.session.user_id)
     


});

module.exports = router;