const db = require('../db');
const bcrypt = require('bcrypt');
const UserModel = {};


//TO DO make this return results of query
UserModel.create = (username, password ) => 
{
    return bcrypt.hash(password, 15)
    .then( (hashedPassword) =>
    {
        let baseSQL = 'INSERT INTO users ("username", "password") VALUES ($1,$2) returning id AS user_id';
        return db.one(baseSQL, [username, hashedPassword])
    })
    .catch( (err) => Promise.reject(err));
}

UserModel.usernameExists = (username) =>
{
    return db.any("SELECT * FROM users WHERE username=$1", [username])
    .then((results) => {
        return Promise.resolve(!(results && results.length == 0));
    }) 
    .catch( (err) => Promise.reject(err));
}

UserModel.authenticate = (username, password) => 
{
    let userId; 
    let baseSQL = `SELECT "user_id", username, password FROM users WHERE username=$1;`;
    return db.any(baseSQL, [username])
    .then( ([results, fields]) =>
    {
        console.log(results);
        if (results && results.length == 1)
        {
            userId = results[0].id;
            return bcrypt.compare(password, results[0].password);
        }
        else 
        {
            console.log("cannot find user");
            return Promise.resolve(-1);
        }
    })
    .then( (passwordsMatch) => 
    {
        if(passwordsMatch)
        {
            console.log("password matches");
            return Promise.resolve(userId);
        }
        else 
        {
            console.log("password does not match");
            return Promise.resolve(-1);
        }
    })
    .catch( (err) => Promise.reject(err));
};


module.exports = UserModel;
