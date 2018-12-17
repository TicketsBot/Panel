const express = require('express')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')
const uuid = require('uuid/v4')
const rateLimit = require('express-rate-limit')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

module.exports = (config) => {
  const app = express()

  // Middleware
  app.use(session({
    secret: uuid(),
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
      host: config.mariadb.host,
      port: 3306,
      user: config.mariadb.username,
      password: config.mariadb.password,
      database: config.server.session.database,
      expiration: 604800 * 1000,
    }),
    cookie: {
      maxAge: 604800 * 1000
    }
  }))
  app.use(cookieParser())
  app.use(rateLimit({
    windowMs: config.server.ratelimit.window * 60 * 1000,
    max: config.server.ratelimit.max
  }))

  // Templating Engine
  app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
  app.set('view engine', 'handlebars')

  return app
}
