const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const helper = require('./test_helper')

const initialNotes = helper.initialNotes

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(initialNotes)
})

describe('get all notes', () => {
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
})

describe('posting a specific note', () => {
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
      .expect(201)
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
})

describe('getting a specific note', () => {
  test('succeeds with a valid id', async () => {
    const response = await api.get('/api/notes')
    const notes = response.body

    expect(notes).toHaveLength(initialNotes.length)

    const first = notes[0]
    const result = await api
      .get(`/api/notes/${first.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const resultNote = result.body

    expect(resultNote).toEqual(first)
  })

  test('fails with status code 404 if note does not exist', async () => {
    const nonExistentId = await helper.getNonExistingId()

    await api
      .get(`/api/notes/${nonExistentId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = 'whattheheckisthis?'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('deleting a specific note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(initialNotes.length - 1)

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
})