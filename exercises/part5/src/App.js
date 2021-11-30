import React, { useState, useEffect, useRef } from 'react'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const userStorageKey = 'loggedNoteAppUser'
  const blogFormRef = useRef()
  
  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
    })
  }, [])


  useEffect(() => {
    const blogUserJSON = window.localStorage.getItem(userStorageKey)
    if (blogUserJSON) {
      setUserInfo(JSON.parse(blogUserJSON))
    }
  }, [])

  const addBlogPost = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      setBlogs(blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      console.log(exception)
    }
  }
  
  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUserInfo(user)
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem(userStorageKey)
  }

  const setUserInfo = (user) => {
    window.localStorage.setItem(userStorageKey, JSON.stringify(user))
    setUser(user)
    blogService.setToken(user.token)
  }

  const incrementLike = async (blog) => {
    try {
      const blogAfterIncrement = {...blog, likes: blog.likes + 1}
      const updatedBlog = await blogService.update(blogAfterIncrement)
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
    } catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => {
    return (
     <LoginForm handleLogin={handleLogin}/>
    )
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  const blogsUI = () => {
    return (
      <div>
        <h2>blogs</h2>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
        <BlogList blogs={sortedBlogs} incrementLike={incrementLike}/>
        <Togglable buttonLabel="Add a new Blog post" ref={blogFormRef}>
          <BlogForm addBlogPost={addBlogPost} incrementLike={incrementLike}/>
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      { user === null ? loginForm() : blogsUI() }
    </div>
  )
}

export default App