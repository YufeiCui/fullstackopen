const express = require('express')
const notesRouter = express.Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({})
    .populate('noteUser', { username: 1, name: 1 })
  res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const note = await Note.findById(id)
  if (!note) {
    return res.status(404).send(`There is no note with the id: ${id}`)
  } else {
    res.json(note)
  }
})

notesRouter.post('/', async (req, res) => {
  if (!req.token) {
    return res.status(401).send({
      error: 'Token missing or invalid'
    })
  }

  if (!req.user) {
    return res.status(401).send({
      error: 'User id missing'
    })
  }

  const body = req.body
  const userId = req.user 

  // find the user who wish to post the note
  const user = await User.findById(userId)

  if (!user) {
    return res.status(404).send(`There is no user with the id: ${decodedToken.id}`)
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    // set the author of the note
    user: user._id
  })

  // add note to the server db
  const newNote = await note.save()

  // add to the author's list of notes
  user.notes = user.notes.concat(newNote._id)
  await user.save()

  res.status(201).json(newNote)
})

notesRouter.delete('/:id', async (req, res) => {
  await Note.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

notesRouter.put('/:id', async (req, res) => {
  if (!req.token) {
    return res.status(401).send({
      error: 'Token missing or invalid'
    })
  }

  if (!req.user) {
    return res.status(401).send({
      error: 'User id missing'
    })
  }

  const id = req.params.id
  const body = req.body

  if (body == null || body.content == null || body.important == null) {
    return res.status(400).send({
      error: 'Missing content or importance!'
    })
  }

  const note = {
    content: body.content,
    important: body.important
  }

  const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true })
  if (!updatedNote) {
    res.status(404).send(`ID: ${id} does not exist`)
  } else {
    res.json(updatedNote)
  }
})

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}

module.exports = notesRouter