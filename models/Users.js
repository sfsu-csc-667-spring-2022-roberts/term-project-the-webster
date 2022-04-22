const db = require('../db');
const bcrypt = require('bcrypt');
const UserModel = {};

UserModel.create = (username, password) => 
{
    const CREATE_USER_QUERY = 
    'INSERT INTO users ("username", "password") VALUES (?,?)';
    return db.any(CREATE_USER_QUERY,[username, password ])
    .then( ([results, fields]) => 
    {
        if(results && results.affectedRows)
        {
            return Promise.resolve(results.insertId);
        }
        else 
        {
            return Promise.resolve(-1);
        }
    })
    .catch( (err) => Promise.reject(err));
}

// db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at $
// {Date.now()}')`)
//         .then(_ => db.any(`SELECT * FROM test_table`))
//         .then(results => response.json(results))
//         .catch(error => {
//             console.log(error)
//             response.json({ error })
//         })


module.exports = UserModel;
