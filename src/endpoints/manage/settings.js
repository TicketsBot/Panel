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

    guilds.isPermitted(guildId, req.session.userId, db, (permitted) => {
      if(!permitted) {
        res.redirect('/')
        return
      }

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
