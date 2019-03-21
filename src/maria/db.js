const mysql = require('mysql2')

module.exports = (config) => {
  const pool = mysql.createPool({
    host: config.mariadb.host,
    user: config.mariadb.username,
    password: config.mariadb.password,
    database: config.mariadb.database,
    connectionLimit: config.mariadb.threads,
    supportBigNumbers: true,
    bigNumberStrings: true
  })
  return pool
}
