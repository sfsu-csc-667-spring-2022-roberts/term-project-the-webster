const db = require('../db');
const bcrypt = require('bcrypt');
const UserModel = {};

// UserModel.create = (username, password) => 
// {
//     bcrypt.hash(password, 15)
//     .then( (hashedPassword) => 
//     {
//         const CREATE_USER_QUERY = 
//         'INSERT INTO users ("username", "password") VALUES ($1,$2)';
//         return db.any(CREATE_USER_QUERY,[username, hashedPassword ]);
//     })
//     .then(results => {
//         console.log(results);
//     })
//     .catch(err => {
//         console.log(err);
//     })
// }

//TO DO make this return results of query
UserModel.create = (username, password ) => 
{
    return bcrypt.hash(password, 15)
    .then( (hashedPassword) =>
    {
        let baseSQL = 'INSERT INTO users ("username", "password") VALUES ($1,$2)';
        db.any(baseSQL, [username, hashedPassword]);
    })
    .catch( (err) => Promise.reject(err));
}

// UserModel.usernameExists = (username) =>
// {
//     return db.any("SELECT * FROM users WHERE username=?", [username])
//     .then(([results, fields]) => {
//         return Promise.resolve(!(results && results.length == 0));
//     }) 
//     .catch( (err) => Promise.reject(err));
// }

// UserModel.authenticate = (username, password) => 
// {
//     let userId; 
//     let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
//     return db.any(baseSQL, [username])
//     .then( ([results, fields]) =>
//     {
//         if (results && results.length == 1)
//         {
//             userId = results[0].id;
//             return bcrypt.compare(password, results[0].password);
//         }
//         else 
//         {
//             return Promise.resolve(-1);
//         }
//     })
//     .then( (passwordsMatch) => 
//     {
//         if(passwordsMatch)
//         {
//             return Promise.resolve(userId);
//         }
//         else 
//         {
//             return Promise.resolve(-1);
//         }
//     })
//     .catch( (err) => Promise.reject(err));
// };


module.exports = UserModel;
