
const debug = process.env.NODE_ENV !== 'production'

const oak = require('oak')
const { join } = require('path')
const _ = require('lodash')
const tools = require('oak-tools')

oak.catchErrors()

const express = require('express')
const app = express()

const port = process.env.PORT ? _.toNumber(process.env.PORT) : 9000

const logger = tools.logger({
  level: debug ? 'debug' : 'info',
  pretty: debug
})

let publicPath = join(__dirname, 'public')

let window = null

app.use(express.static(publicPath))

app.listen(port, function () {
  oak.on('ready', () => loadWindow())
})

app.get('/', function (req, res) {
  res.render('index')
})


async function loadWindow () {
  logger.info({
    message: `Started on port ${port}`
  })
  window = oak.load({
    url: `http://localhost:${port}/`,
    ontop: false,
    insecure: true,
    flags: ['enable-vp8-alpha-playback'],
    sslExceptions: ['localhost'],
    background: '#ffffff'
  })
    .on('ready', function () {
      if (debug) {
        window.debug()
      }
    })
    .on('log.*', function (props) {
      logger[this.event.replace('log.', '')](props)
    })
}
