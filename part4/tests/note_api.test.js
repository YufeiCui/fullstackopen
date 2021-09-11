const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const helper = require('./test_helper')

const initialNotes = helper.initialNotes

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = initialNotes.map(note => new Note(note))
  // creates a list of promises
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  initialNotes.forEach(note => {
    expect(contents).toContain(note.content)
  })
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    date: new Date(),
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(initialNotes.length + 1)

  const contents = notesAtEnd.map(note => note.content)
  expect(contents).toContain(newNote.content)
})

test('note without content will not be added', async () => {
  const newNote = {
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(initialNotes.length)
})

afterAll(() => {
  mongoose.connection.close()
})