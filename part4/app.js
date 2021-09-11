const config = require('./utils/config')
const express = require('express')
// handles async await errors that would otherwise be in try-catch blocks
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Connecting to DB...')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    logger.info('connected to MongoDB')
    return result
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// serving the static files in the folder 'build'
app.use(express.static('build'))

// Cross-Origin Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors())

/*
 * IMPORTANT: The order of the following middlewares matters!!!
 */

// Without the json-parser, the req.body property would be undefined.
// The json-parser functions so that it takes the JSON data of a request,
// transforms it into a JavaScript object and then attaches it to the
// [body property of the request object] before the route handler is called.
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app