import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
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
  }, [user])

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

  const loginForm = () => {
    return (
     <LoginForm handleLogin={handleLogin}/>
    )
  }

  const blogsUI = () => {
    return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
        <ul>
          {blogs.map(blog =>
              <li key={blog.id}><Blog blog={blog}/></li>
          )}
        </ul>
        <Togglable buttonLabel="Add a new Blog post" ref={blogFormRef}>
          <BlogForm addBlogPost={addBlogPost}/>
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