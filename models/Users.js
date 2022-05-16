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

UserModel.getUserIdFromSession = async (sessionId) => {
let  user_id = 0;
return db.any(`SELECT * FROM session where sid=$1`, [socket_id])
  .then(results => {  
        console.log(results[0].sess.user_id)
        user_id= results[0].sess.user_id
    return user_id
  }).catch(err => {
      console.log("ERROR getting user id", err)
  })


  
}


module.exports = UserModel;