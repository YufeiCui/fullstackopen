const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:', req.path)
  logger.info('Body:', req.body)
  logger.info('------')
  next()
}
const userExtractor = (req, res, next) => {
  if (req.token != null) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (decodedToken) {
      req.user = decodedToken.id
    }
  }

  next()
}

const tokenExtractor = (req, res, next) => {
  req.token = getTokenFrom(req)

  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// if req didnt hit any of the endpoints then it will trigger "unknownEndpoint"
const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({
      error: 'Malformatted ID'
    })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).send({
      error: error.message
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token: '+ error.message
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired: '+ error.message
    })
  }

  next(error)
}


const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
  tokenExtractor
}