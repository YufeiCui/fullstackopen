const logger = require('../utils/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res, next) => {
  Blog.find({})
    .then(blogs => {
      res.json(blogs)
    })
    .catch(error => {
      next(error)
    })
})

blogsRouter.post('/', (req, res, next) => {
  const blog = Blog(req.body)

  blog.save()
    .then(newBlog => {
      res.status(201).json(newBlog)
    })
    .catch(error => {
      next(error)
    })
})

module.exports = blogsRouter