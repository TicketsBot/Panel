const Redis = require('ioredis')

const callbacks = {}

module.exports = {
  connect: (config) => {
    pub = new Redis(config.redis.uri)
    sub = new Redis(config.redis.uri)

    sub.subscribe('outbound:channelcategory:list', (err, count) => {})
    sub.on('message', (channel, message) => {
      switch(channel) {
        case 'outbound:channelcategory:list':
          module.exports.onMessage(message)
          break
      }
    })

    return pub
  },

  purgeCache: (redis, guild) => {
    redis.publish('inbound:guild:purgecache', guild)
  },

  onMessage: (message) => {
    var categories = JSON.parse(message)
    var id = categories.guildId

    if(id in callbacks && callbacks[id].length > 0) {
      var cb = callbacks[id].shift()
      cb(categories)
    }
  },

  list: (redis, guild, cb) => {
    if(guild in callbacks) {
      var array = callbacks[guild]
      array.push(cb)
      callbacks[guild] = array
    }
    else {
      callbacks[guild] = [cb]
    }

    redis.publish('inbound:guild:purgecache', guild)
  }
}
