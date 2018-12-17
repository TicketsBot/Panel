const mysql = require('mysql')
const { base64encode, base64decode } = require('nodejs-base64')

module.exports = {
  create: (db) => {
    var query = "CREATE TABLE IF NOT EXISTS guildscache(USERID VARCHAR(20) UNIQUE, GUILDS TEXT);"
    db.query(query)
  },

  getGuilds: (userId, db, cb) => {
    var query = "SELECT GUILDS FROM guildscache WHERE USERID=?;"
    query = mysql.format(query, [userId])

    db.query(query, (err, res, fields) => {
      if(res === undefined || res.length == 0) {
        cb([])
      }
      else {
        cb(JSON.parse(base64decode(res[0].GUILDS)))
      }
    })
  },

  setGuilds: (userId, guildsObj, db) => {
    var guildsEncoded = base64encode(JSON.stringify(guildsObj))
    var query = "INSERT INTO guildscache(USERID, GUILDS) VALUES(?, ?) ON DUPLICATE KEY UPDATE `GUILDS`=VALUES(`GUILDS`);"
    query = mysql.format(query, [userId, guildsEncoded])
    db.query(query, (err, res, fields) => {
      if(err) {
        console.log(err)
      }
    })
  },

  isAdmin: (guildId, userId, db, cb) => {
    var query = "SELECT GUILDID FROM permissions WHERE GUILDID=? AND USERID=? AND ISADMIN=1;"
    query = mysql.format(query, [guildId, userId])

    db.query(query, (err, res, fields) => {
      cb(res !== undefined && res.length > 0)
    })
  },

  getOwnedGuilds: (guildId, userId, db, cb) => {
    module.exports.getGuilds(userId, db, (guilds) => {
      cb(guilds.filter(guild => guild.owner).map(guild => guild.id))
    })
  },

  isPermitted: (guildId, userId, db, cb) => {
    module.exports.getOwnedGuilds(guildId, req.session.userid, db, (ownedGuilds) => {
      module.exports.isAdmin(guildId, req.session.userid, db, (admin) => {
        cb(admin && ownedGuilds.includes(guildId))
      })
    })
  }
}
