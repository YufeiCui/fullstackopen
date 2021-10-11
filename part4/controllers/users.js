const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('notes', { content: 1, important: 1, date: 1 })
  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const body = req.body

  const name = body.name
  const username = body.username
  const password = body.password
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username: username,
    name: name,
    passwordHash: passwordHash
  })

  const savedUser = await user.save()
  res.json(savedUser)
})

module.exports = userRouter