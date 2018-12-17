const validate = require('uuid-validate')
const axios = require('axios')
const isLoggedIn = require('../../utils/isloggedin.js')
const logs = require('../maria/logs.js')
const guilds = require('../maria/guilds.js')

module.exports = (app, config, db) => {
  app.get('/logs/:uuid', (req, res) => {
    if(!isLoggedIn(req)) {
      res.redirect('/login')
      return
    }

    var uuid = req.params.uuid

    if(!validate(uuid, 4)) {
      res.send('Failed to find log on storage servers')
      return
    }

    res.set('Content-Type', 'text/plain')

    logs.getGuildFromUUID(uuid, db, (guildId) => {
      guilds.isPermitted(guildId, req.session.userId, db, (permitted) => {
        if(!permitted) {
          res.redirect('/'')
          return
        }

        logs.getCdnUrl(uuid, db, (url) => {
          axios.get(url)
            .then((queryRes) => {
              res.send(queryRes.data)
            })
            .catch((err) => {
              res.send('Failed to find log on storage servers')
              console.log(err)
            })
        })
      })
    })
  })
}
