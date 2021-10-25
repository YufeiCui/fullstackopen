const express = require('express')
const userRouter = express.Router()
const User = require('./../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs')
  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body || !body.username || !body.password) {
    return res.status(400).send({
      error: 'Missing username or password!'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({ 
    username: body.username, 
    name: body.name, 
    passwordHash
  })
  const savedUser = await user.save()

  res.status(200).json(savedUser)
})

module.exports = userRouter