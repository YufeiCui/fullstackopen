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

describe('deleting a single blog', () => {
  test('no effect on invalid id', async () => {
    const nonExistentId = await helper.getNonExistingId()
    await api.delete(`/api/${nonExistentId}`)

    const blogs = await helper.getAllBlogs()
    expect(blogs).toHaveLength(initialBlogs.length)
  })

  test('properly removes with valid id', async () => {
    const blogs = await helper.getAllBlogs()
    const deleted = blogs[0]

    await api
      .delete(`/api/blogs/${deleted.id}`)
      .expect(204)

    const blogsAfterDeleted = await helper.getAllBlogs()
    const ids = blogsAfterDeleted.map(blog => blog.id)
    
    expect(ids).toHaveLength(initialBlogs.length - 1)
    expect(ids).not.toContain(deleted.id)
  })
})

describe('updating a single blog', () => {
  test('status 404 on invalid id', async () => {
    const nonExistentId = await helper.getNonExistingId()

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send(initialBlogs[0])
      .expect(404)
      
    const blogs = await helper.getAllBlogs()
    expect(blogs).toHaveLength(initialBlogs.length)
  })

  test('status 400 on invalid put body', async () => {
    const blogs = await helper.getAllBlogs()
    const first = blogs[0]
    const titleOnlyBlog = {
      title: 'title only blog with no author'
    }

    await api
      .put(`/api/blogs/${first.id}`)
      .send(titleOnlyBlog)
      .expect(400)

    const blogsAfter = await helper.getAllBlogs()
    expect(blogsAfter).toHaveLength(initialBlogs.length)
  })

  test('properly updates with valid id', async () => {
    const blogs = await helper.getAllBlogs()
    const first = blogs[0]
    const newFirst = {...first, likes: 1 + first.likes}

    const updatedFirst = await api
      .put(`/api/blogs/${first.id}`)
      .send(newFirst)
      .expect(200)

    const blogsAfter = await helper.getAllBlogs()
    const updatedBlog = blogsAfter.find(blog => blog.id === first.id)
    expect(updatedBlog.likes).toBe(first.likes + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})