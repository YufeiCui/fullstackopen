// setting up process.env variables
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

// serving the static files in the folder 'build'
app.use(express.static('build'))

// Cross-Origin Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors())

// Without the json-parser, the req.body property would be undefined.
// The json-parser functions so that it takes the JSON data of a request,
// transforms it into a JavaScript object and then attaches it to the
// [body property of the request object] before the route handler is called.
app.use(express.json())

app.use(morgan('tiny'))

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true
//   }
// ]

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res, next) => {
  Note.find({})
    .then(notes => {
      res.json(notes)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/api/notes/:id', (req, res, next) => {
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

app.post('/api/notes/', (req, res, next) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing!'
    })
  }

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

app.delete('/api/notes/:id', (req, res, error) => {
  const id = req.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/notes/:id', (req, res, next) => {
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

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// if req didnt hit any of the endpoints then it will trigger "unknownEndpoint"
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(404).send({
      error: "Malformatted ID"
    })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})