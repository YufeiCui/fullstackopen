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

module.exports = blogsRouter