const validate = require('uuid-validate')
const https = require('https')
const logs = require('../maria/logs.js')

module.exports = (app, config, db) => {
  app.get('/logs/:uuid', (req, res) => {
    var uuid = req.params.uuid

    if(!validate(uuid, 4)) {
      res.send('Failed to find log on storage servers')
      return
    }

    res.set('Content-Type', 'text/plain')

    logs.getCdnUrl(uuid, db, (url) => {
      // Axios minifies any resonses
      https.get(url, (queryRes) => {
        var data = ''

        queryRes.on('data', (chunk) => {
          data += chunk
        })

        queryRes.on('end', () => {
          res.send(data)
        })
      }).on('error', (err) => {
        res.send('Failed to find log on storage servers')
      })
    })
  })
}
