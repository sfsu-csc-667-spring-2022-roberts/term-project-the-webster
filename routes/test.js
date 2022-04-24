const express = require("express");
const { response } = require("../app");
const router = express.Router();
const db = require('../db');
router.get("/", (request, response) => {
   
//     db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at $
// {Date.now()}')`)
//         .then(_ => db.any(`SELECT * FROM test_table`))
//         .then(results => response.json(results))
//         .catch(error => {
//             console.log(error)
//             response.json({ error })
//         })
// });
let name = 'wat';
let pass = 'watt'

db.any(`INSERT INTO users ("username", "password") VALUES ($1,$2)`,[name, pass] )
        .then(_ => 
        db.any(`SELECT * FROM users`))
        .then(results => response.json(results))
        .catch(error => {
            console.log(error)
            response.json({ error })
        })
});
module.exports = router;