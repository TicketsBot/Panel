const axios = require('axios')

module.exports = {
  purgeCaches: (config, guildId) => {
    config.bot.httpServers.forEach((host) => {
      axios.get(`http://${host}/purgecache/${guildId}?key=${config.bot.key}`)
        .then((res) => {})
        .catch((err) => {
          cb(console.log(err))
        })
    })
  }
}
