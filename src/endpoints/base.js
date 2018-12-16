const mysql = require('mysql')
const axios = require('axios')
const isLoggedIn = require('../utils/isloggedin.js')
const guilds = require('../maria/guilds.js')

module.exports = (app, config, db) => {
  app.get('/', (req, res) => {
    if(!isLoggedIn(req)) {
      res.redirect('/login')
      return
    }

    getGuildIds(req.session.userid, (ids) => {
      guilds.getGuilds(req.session.userid, db, (guilds) => {
        var adminGuilds = []
        guilds.forEach((guild) => {
          if(guild.owner || ids.includes(guild.id)) {
            adminGuilds.push(guild)
          }
        })

        res.render('index', {
          name: req.session.name,
          mainsite: config.server.mainSite,
          isNotAdmin: adminGuilds.length == 0,
          baseUrl: config.server.baseUrl,
          guilds: adminGuilds
        })
      })
    })
  })

  function getGuildIds(userid, cb) {
    var query = "SELECT GUILDID FROM permissions WHERE USERID=? AND ISADMIN=1;"
    query = mysql.format(query, [userid])

    db.query(query, (err, res, fields) => {
      var isNotAdmin = res === undefined || res.length == 0

      var ids = []
      res.forEach((value) => {
        ids.push(value.GUILDID)
      })

      cb(ids)
    })
  }
}
