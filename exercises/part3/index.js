// library to set up process.env
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

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

// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

// const peopleCount = persons.length

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/api/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const info = `<p>Phonebook has info for ${count} people</p>`
      const date = `<p>${new Date()}</p>`
      res.send(info + date)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).send(`ID: ${id} does not exist`)
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).send(`ID: ${id} does not exist`)
      }
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Missing name or number!'
    })
  }

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      if (!updatedPerson) {
        res.status(404).send(`ID: ${id} does not exist`)
      } else {
        res.json(updatedPerson)
      }
    })
    .catch(error =>{
      next(error)
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Missing name or number!'
    })
  }

  // if (isPersonDuplicate(body.name)) {
  //   return res.status(400).json({
  //     error: 'name must be unique!'
  //   })
  // }

  const person = Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(newPerson => {
      res.json(newPerson)
    })
    .catch(error => {
      next(error)
    })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)


// error handling: this is where `next(error)` will reach

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({
      error: 'Malformatted ID'
    })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).send({
      error: error.message
    })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})