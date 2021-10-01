const express = require('express')
const notesRouter = express.Router()
const Note = require('../models/note')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
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

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  // add note to the server db
  const newNote = await note.save()
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