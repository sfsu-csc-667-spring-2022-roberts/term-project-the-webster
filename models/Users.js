const db = require('../db');
const UserModel = {};

UserModel.create = (username, password) => 
{
    let baseSQL = `INSERT INTO user ("username, password") VALUES ('?,?')`
    return  db.execute(baseSQL, [username, password])
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
