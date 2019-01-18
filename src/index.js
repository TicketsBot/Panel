// Imports
const fs = require('fs')
const toml = require('toml')

// Setup config
var config = toml.parse(fs.readFileSync('config.toml', 'utf8'))

// Setup database
const maria = require('./maria/db.js')(config)
const guilds = require('./maria/guilds.js')
guilds.create(maria)

// Setup Redis
const Redis = require('./redis/redis.js')
const redis = Redis.connect(config)

// Create server
const host = config.server.host
const port = config.server.port
const app = require('./server.js')(config)

// Register endpoints
require('./endpoints/base.js')(app, config, maria)
require('./endpoints/login.js')(app, config)
require('./endpoints/callback.js')(app, config, maria)
require('./endpoints/logout.js')(app, config)
require('./endpoints/manage/settings.js')(app, config, maria, redis)
require('./endpoints/logs.js')(app, config, maria)
require('./endpoints/manage/logs.js')(app, config, maria)

app.listen(port, host, () => {
  console.log(`Listening on ${host}:${port}`)
})
