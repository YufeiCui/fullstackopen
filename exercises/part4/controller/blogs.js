const logger = require('../utils/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes || 0,
  })
  const newBlog = await blog.save()
  res.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body

  if (!body || !body.title || !body.author) {
    return res.status(400).send({
      error: "Missing title or author!"
    })
  }

  const blog = {
    author: body.author,
    title: body.title,
    likes: body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog ,{ new: true })
  if (!updatedBlog) {
    res.status(404).send(`ID: ${id} does not exist`)
  } else {
    res.json(updatedBlog)
  }
})

module.exports = blogsRouter