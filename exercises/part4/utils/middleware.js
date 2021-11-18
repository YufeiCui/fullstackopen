const { request } = require('express')
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:', req.path)
  logger.info('Body:', req.body)
  logger.info('------')

  next()
}

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({
    error: 'unknown endpoint'
  })
}

const tokenExtractor = (req, res, next) => {
  req.token = getTokenFrom(req)

  next() 
}

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}

const userExtractor = (req, res, next) => {
  if (req.token !== null) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (decodedToken) {
      req.user = decodedToken.id
    }
  }
  
  next()
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name == 'ValidationError') {
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

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler
}