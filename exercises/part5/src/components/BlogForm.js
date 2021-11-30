import React, { useState } from "react"

const BlogForm = ({ addBlogPost }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createNewBlog = () => {
    return {title, author, url}
  }

  const resetBlogForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    await addBlogPost(createNewBlog())
    resetBlogForm()
  }

  return (
    <div>
      <h2>Create New</h2>
        <form onSubmit={onSubmit}>
          <div>
            title: <input value={title} onChange={ (event) => {setTitle(event.target.value)} }/>
          </div>
          <div>
            author: <input value={author} onChange={ (event) => {setAuthor(event.target.value)} }/>
          </div>
          <div>
            url: <input value={url} onChange={ (event) => {setUrl(event.target.value)} }/>
          </div>
          <button type="submit">create</button>
        </form>
    </div>
  )
}



export default BlogForm