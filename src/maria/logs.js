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

  getLogs: (guildId, ticketId, username, userId, db, cb) => {
    var query = "SELECT UUID, USERID, USERNAME, TICKETID FROM ticketarchive WHERE GUILDID=? "

    var variables = [guildId]

    if(ticketId !== undefined && ticketId != "") {
      query += " AND TICKETID=? "
      variables.push(ticketId)
    }

    if(username !== undefined && username != "") {
      query += " AND USERNAME LIKE ? "
      variables.push('%' + username + '%')
    }

    if(userId !== undefined && userId != "") {
      query += " AND USERID=? "
      variables.push(parseFloat(userId))
    }

    query += "ORDER BY TICKETID DESC;"
    query = mysql.format(query, variables)

    console.log(query)

    db.query(query, (err, res, fields) => {
      if(res === undefined) {
        cb([])
      }
      else {
        cb(res)
      }
    })
  },

  getTicketById: (guildId, ticketId, db, cb) => {
    var query = "SELECT UUID, USERID, USERNAME, TICKETID FROM ticketarchive WHERE GUILDID=? AND TICKETID=?;"
    query = mysql.format(query, [guildId, ticketId])

    db.query(query, (err, res, fields) => {
      if(res === undefined) {
        cb([])
      }
      else {
        cb([res[0]])
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
