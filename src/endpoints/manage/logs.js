const mysql = require('mysql')
const isLoggedIn = require('../../utils/isloggedin.js')
const guilds = require('../../maria/guilds.js')
const logsdb = require('../../maria/logs.js')

module.exports = (app, config, db) => {
  app.get('/manage/:guildid/logs/page/:page', (req, res) => {
    if(!isLoggedIn(req)) {
      res.redirect('/login')
      return
    }

    var guildId = req.params.guildid
    var page = req.params.page

    guilds.isPermitted(guildId, req.session.userid, db, (permitted) => {
      if(!permitted) {
        res.redirect('/')
        return
      }

      // Verify the page is a valid number
      if(isNaN(parseInt(page, 10))) {
        res.redirect('/')
        return
      }

      page = parseInt(page, 10)

      if(page < 1)  {
        res.redirect('/')
        return
      }

      var displayedLogs = []
      var pageLimit = 30
      logsdb.getLogs(guildId, req.query.ticketid, req.query.username, req.query.userid, db, (logs) => {
        for(var i = (page - 1) * pageLimit; i < (page - 1) * pageLimit + pageLimit; i++) {
          if(i >= logs.length) break
          else displayedLogs.push(logs[i])
        }

        res.render('logs', {
          name: req.session.name,
          mainsite: config.server.mainSite,
          baseUrl: config.server.baseUrl,
          guildId: guildId,
          logs: displayedLogs.reverse(),
          isPageOne: page == 1,
          previousPage: page - 1,
          nextPage: page + 1
        })
      })
    })
  })
}
