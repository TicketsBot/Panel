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
  }
}
