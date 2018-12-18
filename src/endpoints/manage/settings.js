const mysql = require('mysql')
const isLoggedIn = require('../../utils/isloggedin.js')
const guilds = require('../../maria/guilds.js')
const settings = require('../../maria/settings.js')
const mediator = require('../../mediator.js')

module.exports = (app, config, db) => {
  app.get('/manage/:guildid/settings', (req, res) => {
    if(!isLoggedIn(req)) {
      res.redirect('/login')
      return
    }

    var guildId = req.params.guildid

    guilds.isPermitted(guildId, req.session.userid, db, (permitted) => {
      if(!permitted) {
        res.redirect('/')
        return
      }

      var updated = false

      var invalidPrefix = false
      if(req.query.prefix !== undefined) {
        var prefix = req.query.prefix
        if(prefix.length > 8 || prefix.length < 1) {
          invalidPrefix = true
        }
        else {
          settings.setPrefix(guildId, prefix, db)
          updated = true
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
          updated = true
        }
      }

      if(updated) {
        mediator.purgeCaches(config, guildId)
      }

      settings.getPrefix(guildId, db, (prefix) => {
        // DB doesn't update fast enough to be able to select new values
        if(req.query.prefix !== undefined && !invalidPrefix) {
          prefix = req.query.prefix
        }

        settings.getWelcomeMessage(guildId, db, (welcomeMessage) => {
          // DB doesn't update fast enough to be able to select new values
          if(req.query.welcomeMessage !== undefined && !invalidMessage) {
            welcomeMessage = req.query.welcomeMessage
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
}
