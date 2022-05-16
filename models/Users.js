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
        
        if(results && results.affectedRows)
        {
            return Promise.resolve(results.insertId);
        }
        else 
        {
            return Promise.resolve(-1);
        }
    })
    .catch( (err) => Promise.resolve(err));
}

UserModel.usernameExists = (username) =>
{
    return db.any("SELECT * FROM users WHERE username=$1", [username])
    .then((results) => {
        return Promise.resolve(!(results && results.length == 0));
    }) 
    .catch( (err) => Promise.resolve(err));
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
            userId = results.id;
            return bcrypt.compare(password, results.password);
        }
        else 
        {
            console.log("cannot find user");
            return Promise.resolve(userId);
        }
    })
    .catch( (err) => Promise.resolve(err));
};

module.exports = UserModel;