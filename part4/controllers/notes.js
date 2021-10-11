const express = require('express')
const notesRouter = express.Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })
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
  const body = req.body

  // find the user who wish to post the note
  const user = await User.findById(body.user)

  if (!user) {
    return res.status(404).send(`There is no user with the id: ${body.user}`)
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
  const id = req.params.id
  const body = req.body

  if (!body.content || !body.important) {
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

module.exports = notesRouter