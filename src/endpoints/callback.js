const session = require('express-session')
const axios = require('axios')
const querystring = require('querystring')
const guilds = require('../maria/guilds.js')

module.exports = (app, config, db) => {
  app.get('/callback', (req, res) => {
    var code = req.query.code
    if(code == undefined) {
      res.send('Discord provided an invalid OAUTH code')
      return
    }

    var data = {
      client_id: config.oauth.id,
      client_secret: config.oauth.secret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${config.server.baseUrl}/callback`,
      scope: 'identify guilds'
    }

    axios.post('https://discordapp.com/api/oauth2/token', querystring.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((postRes) => {
      req.session.token = postRes.data.access_token

      getUserId(postRes.data.access_token, (array) => {
        req.session.name = array[0]
        req.session.userid = array[1]

        getGuilds(req.session.token, (data) => {
          guilds.setGuilds(req.session.userid, data, db)
          res.redirect('/')
        })
      })
    }).catch((err) => {
      res.redirect('/login')
    })
  })

  function getUserId(token, cb) {
    axios.get('https://discordapp.com/api/v6/users/@me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'DiscordBot (https://github.com/TicketsBot/Panel 1.0.0)'
      }
    }).then((res) => {
      cb([res.data.username, res.data.id])
    }).catch((err) => {
      console.log(err)
    })
  }

  function getGuilds(token, cb) {
    axios.get('https://discordapp.com/api/v6/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'DiscordBot (https://github.com/TicketsBot/Panel 1.0.0)'
      }
    }).then((res) => {
      cb(res.data)
    }).catch((err) => {
      console.log("ratelimited")
      cb([])
    })
  }
}
