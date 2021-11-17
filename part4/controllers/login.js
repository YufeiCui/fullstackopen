const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const loginRouter = express.Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const body = req.body
  const username = body.username
  const password = body.password

  const user = await User.findOne({ username: username })
  const canLogIn = user && await bcrypt.compare(password, user.passwordHash)

  if (!canLogIn) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  // create token for authenticated user
  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60 * 60 * 3 } // 3 hours 
  )

  res.status(200).send({ token, username: user.username, name: user.name, id: user._id })
})

module.exports = loginRouter