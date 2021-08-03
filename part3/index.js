const express = require('express')
const cors = require('cors')
const app = express()

// serving the static files in the folder 'build'
app.use(express.static('build'))

// Cross-Origin Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors())

// Without the json-parser, the req.body property would be undefined.
// The json-parser functions so that it takes the JSON data of a request,
// transforms it into a JavaScript object and then attaches it to the
// [body property of the request object] before the route handler is called.
app.use(express.json())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const found = notes.find(note => note.id === id)
  if (found != undefined) {
    res.json(found)
  } else {
    res.status(404).send(`There is no note with the id ${req.params.id}`)
  }
})

const generateID = () => {
  const maxID = notes.length > 0
    // use ... notes.map() b/c Math.max takes numbers not list
    ? Math.max(...notes.map(note => note.id))
    : 0

  return maxID + 1
}

app.post('/api/notes/', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing!'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateID()
  }

  // add note to the server db
  notes = notes.concat(note)

  res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  // pretend delete
  notes.filter(note => note.id !== id)

  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// if req didnt hit any of the endpoints then it will trigger "unknownEndpoint"
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})