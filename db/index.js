const pgp = require("pg-promise")();
const connection = pgp(process.env.DATABASE_URL);
console.log(process.env)
module.exports = connection;