const express = require('express')
const loginRouter = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const body = req.body 

  const hasLoginInfo = body && body.username && body.password
  let canLogIn = false
  let user;
  if (hasLoginInfo) {
    user = await User.findOne({ username: body.username })
    canLogIn = hasLoginInfo && user && await bcrypt.compare(body.password, user.passwordHash)
  }

  if (!canLogIn) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  // create auth token 
  const payload = { username: user.username, id: user._id }
  const token = jwt.sign(
    payload, 
    process.env.SECRET, 
    { expiresIn: 60 * 60 * 3 }
  )

  res.status(200).json({ token, username: user.username, name: user.name, id: user._id })
})

module.exports = loginRouter