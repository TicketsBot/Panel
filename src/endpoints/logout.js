module.exports = (app, config) => {
  app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect(config.server.mainSite)
  })
}
