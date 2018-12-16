const mysql = require('mysql')
const { base64encode, base64decode } = require('nodejs-base64')

module.exports = {
  getPrefix: (guildId, db, cb) => {
    var query = "SELECT PREFIX FROM prefix WHERE GUILDID=?;"
    query = mysql.format(query, [guildId])

    db.query(query, (err, res, fields) => {
      if(res === undefined || res.length == 0) {
        cb('t!')
      }
      else {
        cb(res[0].PREFIX)
      }
    })
  },

  getWelcomeMessage: (guildId, db, cb) => {
    var query = 'SELECT MESSAGE FROM welcomemessages WHERE GUILDID=?;'
    query = mysql.format(query, [guildId])

    db.query(query, (err, res, fields) => {
      if(res === undefined || res.length == 0) {
        cb('No message specified')
      }
      else {
        cb(res[0].MESSAGE)
      }
    })
  },

  setPrefix: (guildId, prefix, db) => {
    var query = "INSERT INTO prefix(GUILDID, PREFIX) VALUES(?, ?) ON DUPLICATE KEY UPDATE `PREFIX`=VALUES(`PREFIX`);"
    query = mysql.format(query, [guildId, prefix])

    db.query(query, (err, res, fields) => {
      if(err) {
        console.log(err)
      }
    })
  },

  setWelcomeMessage: (guildId, message, db) => {
    var query = "INSERT INTO welcomemessages(GUILDID, MESSAGE) VALUES(?, ?) ON DUPLICATE KEY UPDATE `MESSAGE`=VALUES(`MESSAGE`);"
    query = mysql.format(query, [guildId, message])

    db.query(query, (err, res, fields) => {
      if(err) {
        console.log(err)
      }
    })
  }
}
