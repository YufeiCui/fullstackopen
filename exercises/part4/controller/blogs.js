const logger = require('../utils/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('./../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  if (!req.token) {
    return res.status(401).send({
      error: 'Token missing or invalid'
    })
  }

  if (!req.user) {
    return res.status(401).send({
      error: 'User id missing'
    })
  }

  const userId = req.user
  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).send(`There is no user with the id: ${userId}`)
  }

  const body = req.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user._id, // save the user who owns the blog
    likes: body.likes || 0,
    url: body.url
  })
  const newBlog = await blog.save()

  // add to the user's list of blogs
  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()

  res.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  if (!req.token) {
    return res.status(401).send({
      error: 'Token missing or invalid'
    })
  }

  if (!req.user) {
    return res.status(401).send({
      error: 'User id missing'
    })
  }

  const blog = await Blog.findById(req.params.id)
  const userId = req.user

  if (!blog || (blog.user.toString() !== userId.toString())) {
    return res.status(404).send({
      error: 'Not an authorized user to perform DELETE'
    })
  }

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
    likes: body.likes || 0,
    url: body.url || ''
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog ,{ new: true })
  if (!updatedBlog) {
    res.status(404).send(`ID: ${id} does not exist`)
  } else {
    res.json(updatedBlog)
  }
})

module.exports = blogsRouter