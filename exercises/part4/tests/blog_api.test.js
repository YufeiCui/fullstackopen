const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

const initialBlogs = helper.blogs

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const blogPromises = blogObjects.map(blog => blog.save())
  await Promise.all(blogPromises)
})

describe('getting all blogs', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const returned = await api.get('/api/blogs')

    expect(returned.body).toHaveLength(initialBlogs.length)
  })

})
describe('posting a single blog', () => {
  test('blogs are uniquely identified by their "id" property', async () => {
    const blog = {
      title: "testing can be really fun!",
      author: "Yufei Cui"
    }

    const newBlog = await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(newBlog.body.id).toBeDefined()
  })

  test('blogs posted to the server are saved properly', async () => {
    const blog = {
      title: "testing can be really fun!",
      author: "Yufei Cui"
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const returned = await api.get('/api/blogs')
    const blogs = returned.body
    const titles = blogs.map(b => b.title)
    const authors = blogs.map(b => b.author)

    expect(blogs).toHaveLength(1 + initialBlogs.length)
    expect(titles).toContain(blog.title)
    expect(authors).toContain(blog.author)
  })

  test('blog api should default likes to 0 if it was not set', async () => {
    const blog = {
      title: "testing can be really fun!",
      author: "Yufei Cui"
    }

    const returned = await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlog = returned.body

    expect(newBlog.likes).toBeDefined()
    expect(newBlog.likes).toBe(0)
  })

  test('bad post request without title or author', async () => {
    const blogs = [
      { },
      { title: "no author title" },
      { author: "no title author" }
    ]

    const blogPromises = blogs.map(async (blog) => {
      await api
      .post('/api/blogs')
      .send(blog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    })

    await Promise.all(blogPromises)
  })
})

afterAll(() => {
  mongoose.connection.close()
})