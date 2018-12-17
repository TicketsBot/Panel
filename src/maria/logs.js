const mysql = require('mysql')

module.exports = {
  getCdnUrl: (uuid, db, cb) => {
    var query = "SELECT CDNURL FROM ticketarchive WHERE UUID=?;"
    query = mysql.format(query, [uuid])

    db.query(query, (err, res, fields) => {
      if(res === undefined || res.length == 0) {
        cb(undefined)
      }
      else {
        cb(res[0].CDNURL)
      }
    })
  },

  getAllLogs: (guildId, db, cb) => {
    var query = "SELECT UUID, USERID, USERNAME, TICKETID FROM ticketarchive WHERE GUILDID=? ORDER BY TICKETID DESC;"
    query = mysql.format(query, [guildId])

    db.query(query, (err, res, fields) => {
      if(res === undefined) {
        cb([])
      }
      else {
        cb(res)
      }
    })
  },

  getGuildFromUUID: (uuid, db, cb) => {
    var query = "SELECT GUILDID FROM ticketarchive WHERE UUID=?;"
    query = mysql.format(query, [uuid])

    db.query(query, (err, res, fields) => {
      if(res === undefined) {
        cb(-1)
      } else {
        cb(res[0].GUILDID)
      }
    })
  }
}
