const mysql = require('mysql')
const isLoggedIn = require('../../utils/isloggedin.js')
const guilds = require('../../maria/guilds.js')
const settings = require('../../maria/settings.js')

module.exports = (app, config, db) => {
  app.get('/manage/:guildid/settings', (req, res) => {
    if(!isLoggedIn(req)) {
      res.redirect('/login')
      return
    }

    var guildId = req.params.guildid

    var invalidPrefix = false
    if(req.query.prefix !== undefined) {
      var prefix = req.query.prefix
      if(prefix.length > 8 || prefix.length < 1) {
        invalidPrefix = true
      }
      else {
        settings.setPrefix(guildId, prefix, db)
      }
    }

    var invalidMessage = false
    if(req.query.welcomeMessage !== undefined) {
      var message = req.query.welcomeMessage
      if(message.length > 1000 || message.length < 1) {
        invalidMessage = true
      }
      else {
        settings.setWelcomeMessage(guildId, message, db)
      }
    }

    settings.getPrefix(guildId, db, (prefix) => {
      settings.getWelcomeMessage(guildId, db, (welcomeMessage) => {
        getOwnedGuilds(guildId, req.session.userid, (ownedGuilds) => {
          isAdmin(guildId, req.session.userid, (admin) => {
            if(!admin && !ownedGuilds.includes(guildId)) {
              res.redirect('/')
              return
            }

            res.render('settings', {
              name: req.session.name,
              mainsite: config.server.mainSite,
              baseUrl: config.server.baseUrl,
              guildId: guildId,
              prefix: prefix,
              welcomeMessage: welcomeMessage,
              invalidPrefix: invalidPrefix,
              invalidMessage: invalidMessage
            })
          })
        })
      })
    })
  })

  function isAdmin(guildId, userId, cb) {
    var query = "SELECT GUILDID FROM permissions WHERE GUILDID=? AND USERID=? AND ISADMIN=1;"
    query = mysql.format(query, [guildId, userId])

    db.query(query, (err, res, fields) => {
      cb(res !== undefined && res.length > 0)
    })
  }

  function getOwnedGuilds(guildId, userId, cb) {
    guilds.getGuilds(userId, db, (guilds) => {
      cb(guilds.filter(guild => guild.owner).map(guild => guild.id))
    })
  }
}
