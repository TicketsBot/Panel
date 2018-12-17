const mysql = require('mysql')

module.exports = (config) => {
  const pool = mysql.createPool({
    host: config.mariadb.host,
    user: config.mariadb.username,
    password: config.mariadb.password,
    database: config.mariadb.database,
    connectionLimit: config.mariadb.threads
  })
  return pool
}
