const db = require('../db');
const bcrypt = require('bcrypt');
const UserModel = {};


//TO DO make this return results of query
UserModel.create = (username, password ) => 
{
    return bcrypt.hash(password, 15)
    .then( (hashedPassword) =>
    {
        let baseSQL = 'INSERT INTO users ("username", "password") VALUES ($1,$2)';
        return db.any(baseSQL, [username, hashedPassword]);
    })
    .then(results => {
        console.log("results from create is:" + results);
        if(results && results.affectedRows)
        {
            console.log("insertID is:" + results.insertId);
            return Promise.resolve(results.insertId);
        }
        else 
        {
            console.log("else statement");
            return Promise.resolve(-1);
        }
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
    let baseSQL = `SELECT id, username, password FROM users WHERE username=$1;`;
    return db.any(baseSQL, [username])
    .then( ([results, fields]) =>
    {
        console.log(results);
        if (results)
        {
            console.log("RESULTS EXIST!")
            console.log(results)
            userId = results.id;
            console.log(userId)
            console.log(bcrypt.compare(password, results.password))
            return bcrypt.compare(password, results.password);
        }
        else 
        {
            console.log("cannot find user");
            return Promise.resolve(userId);
        }
    })
    .catch( (err) => Promise.reject(err));
};



module.exports = UserModel;