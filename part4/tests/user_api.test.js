const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

const passwordHash = bcrypt.hashSync('password', 10)
let initialUsers = [
  { username: 'Groot', passwordHash: passwordHash },
  { username: 'Star-lord', passwordHash: passwordHash },
]

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(initialUsers)
})

describe('when there a users in the databse', () => {
  test('verifying the existence of users in the database', async () => {
    const users = await helper.getAllUsers()
    expect(users).toHaveLength(initialUsers.length)
  })

  test('adding a new user to the database', async () => {
    const users = await helper.getAllUsers()
    const newUser = {
      name: 'John Cena',
      username: 'cenajohn',
      password: 'UCantSeeMe'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.getAllUsers() 
    expect(usersAtEnd).toHaveLength(users.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const firstInUsersDb = initialUsers[0]
    const usersAtStart = await helper.getAllUsers()

    const userToBeInserted = {
      username: firstInUsersDb.username,
      password: '123'
    }

    const result = await api
      .post('/api/users')
      .send(userToBeInserted)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique.')
    
    const usersAtEnd = await helper.getAllUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})