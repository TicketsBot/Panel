const validate = require('uuid-validate')
const axios = require('axios')
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
}
