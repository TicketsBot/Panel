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
  },

  getChannelCategory: (guildId, db, cb) => {
    var query = 'SELECT CATEGORYID FROM channelcategory WHERE GUILDID=?;'
    query = mysql.format(query, [guildId])

    db.query(query, (err, res, fields) => {
      if(res === undefined || res.length == 0) {
        cb(-1)
      }
      else {
        cb(res[0].CATEGORYID)
      }
    })
  },

  setChannelCategory: (guildId, categoryId, db) => {
    var query = 'INSERT INTO channelcategory(GUILDID, CATEGORYID) VALUES(?, ?) ON DUPLICATE KEY UPDATE `CATEGORYID`=VALUES(`CATEGORYID`);'
    query = mysql.format(query, [guildId, categoryId])

    db.query(query, (err, res, fields) => {
      if(err) {
        console.log(err)
      }
    })
  },

  getTicketLimit: (guildId, db, cb) => {
    var query = 'SELECT TICKETLIMIT FROM ticketlimit WHERE GUILDID=?;'
    query = mysql.format(query, [guildId])


    db.query(query, (err, res, fields) => {
      if(res === undefined || res.length == 0) {
        cb(5)
      }
      else {
        cb(res[0].TICKETLIMIT)
      }
    })
  },

  setTicketLimit: (guildId, limit, db) => {
    var query = 'INSERT INTO ticketlimit(GUILDID, TICKETLIMIT) VALUES(?, ?) ON DUPLICATE KEY UPDATE `TICKETLIMIT` = VALUES(`TICKETLIMIT`);'
    query = mysql.format(query, [guildId, limit])

    db.query(query, (err, res, fields) => {
      if(err) {
        console.log(err)
      }
    })
  }
}
