const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

// serving the static files in the folder 'build'
app.use(express.static('build'))

app.use(express.json())
app.use(cors())

morgan.token('post', function getId (req) {
  if (req.method == 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const peopleCount = persons.length

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  const info = `<p>Phonebook has info for ${peopleCount} people</p>`
  const date = `<p>${new Date()}</p>`
  res.send(info + date)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person == undefined) {
    return res.status(404).send(`There is no note with the id ${req.params.id}`)
  }

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person == undefined) {
    return res.status(404).send(`There is no note with the id ${req.params.id}`)
  }

  // delete from the server db
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateID = () => {
  const maxID = persons.length > 0
  // use ... notes.map() b/c Math.max takes numbers not list
  ? Math.max(...persons.map(person => person.id))
  : 0

  return maxID + 1
}

const isPersonDuplicate = (name) => {
  return persons.find(person => person.name === name) != undefined
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Missing name or number!'
    })
  }

  if (isPersonDuplicate(body.name)) {
    return res.status(400).json({
      error: 'name must be unique!'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateID()
  }

  // add to the server db
  persons = persons.concat(person)

  res.json(person)
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown endpoint"
  })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})