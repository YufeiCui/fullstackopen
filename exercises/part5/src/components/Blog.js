import React from 'react'
import './Blog.css'

const Blog = ({ blog, isExpanded, toggleExpansionFor, incrementLike}) => {
  const handleLike = async (event) => {
    event.preventDefault()
    try {
      await incrementLike(blog)
    } catch (exception) {
      console.log(exception)
    }
  }

  const toggleExpansion = (event) => {
    event.preventDefault()
    toggleExpansionFor(blog.id)
  }

  const simpleBlogView = () => {
    return (
      <>
        {blog.title} {blog.author} 
        <button onClick={toggleExpansion}>expand</button>
      </>
    )
  }

  const detailedBlogView = () => {
    return (
      <>
        <div>
          {blog.title} 
          <button onClick={toggleExpansion}>collapse</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes: {blog.likes}
          <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.author}</div>
      </>
    )
  }

 return (
   <div className="blog">
     {isExpanded 
    ? detailedBlogView()
    : simpleBlogView() 
    }
   </div>
 )
}

export default Blog