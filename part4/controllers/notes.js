const express = require('express')
const notesRouter = express.Router()
const Note = require('../models/note')

notesRouter.get('/', (req, res, next) => {
  Note.find({})
    .then(notes => {
      res.json(notes)
    })
    .catch(error => {
      next(error)
    })
})

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then(note => {
      if (!note) {
        res.status(404).send(`There is no note with the id ${id}`)
      } else {
        res.json(note)
      }
    })
    .catch(error => {
      next(error)
    })
})

notesRouter.post('/', (req, res, next) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  // add note to the server db
  note.save()
    .then(newNote => {
      res.json(newNote)
    })
    .catch(error => {
      next(error)
    })
})

notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
      return result
    })
    .catch(error => {
      next(error)
    })
})

notesRouter.put('/:id', (req, res, next) => {
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

  Note.findByIdAndUpdate(id, note, { new: true })
    .then(updatedNote => {
      if (!updatedNote) {
        res.status(404).send(`ID: ${id} does not exist`)
      } else {
        res.json(updatedNote)
      }
    })
    .catch(error => {
      next(error)
    })
})

module.exports = notesRouter