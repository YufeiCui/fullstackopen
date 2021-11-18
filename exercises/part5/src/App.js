import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const userStorageKey = 'loggedNoteAppUser'
  
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

  
  const addBlogPost = async (event) => {
    event.preventDefault()
    const blog = createNewBlog()
    const newBlog = await blogService.create(blog)
    setBlogs(blogs.concat(newBlog))
    resetBlogFields()
  }
  
  const createNewBlog = () => {
    return {title, author, url}
  }

  const resetBlogFields = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      setUserInfo(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception);
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.removeItem(userStorageKey)
  }

  const setUserInfo = (user) => {
    window.localStorage.setItem(userStorageKey, JSON.stringify(user))
    setUser(user)
    blogService.setToken(user.token)
  }

  const loginForm = () => {
    return (
     <div>
      <div>
        <h2>Log in to blog application</h2>
      </div>
      <form onSubmit={handleLogin}>
        <div>
          username: 
          <input 
            type="text" 
            value={username} 
            onChange={ (event) => setUsername(event.target.value) }
          />
        </div>
        <div>
          password: 
          <input 
            type="text" 
            value={password}
            onChange={ (event) => {setPassword(event.target.value)} }
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
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
        <h2>Create New</h2>
        <form onSubmit={addBlogPost}>
          <div>
            title: <input value={title} onChange={ (event) => {setTitle(event.target.value)} }/>
          </div>
          <div>
            author: <input value={author} onChange={ (event) => {setAuthor(event.target.value)}}/>
          </div>
          <div>
            url: <input url={url} onChange={ (event) => {setUrl(event.target.value)}}/>
          </div>
          <button type="submit">create</button>
        </form>
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