const querystring = require('querystring')

module.exports = (app, config) => {
  app.get('/login', (req, res) => {
    var redirect = querystring.escape(`${config.server.baseUrl}/callback`)
    res.redirect(`https://discordapp.com/oauth2/authorize?response_type=code&redirect_uri=${redirect}&scope=identify+guilds&client_id=${config.oauth.id}`)
  })
}
