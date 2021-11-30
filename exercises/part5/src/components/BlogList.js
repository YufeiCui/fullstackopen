import React, { useEffect, useState } from "react"
import Blog from "./Blog"

const BlogList = ({ blogs, incrementLike }) => {
  const [expand, setExpand] = useState(blogs.reduce((acc, item) => ({...acc, [item.id]: false }), {}))

  const expandAll = (event) => {
    event.preventDefault()
    setExpand(blogs.reduce((acc, item) => ({...acc, [item.id]: true }), {}))
  }

  const collapseAll = (event) => {
    event.preventDefault()
    setExpand(blogs.reduce((acc, item) => ({...acc, [item.id]: false }), {}))
  }

  const toggleExpansionFor = (id) => {
    setExpand({...expand, [id]: !expand[id]})
  }

  return (
    <>
      <div>
        <button onClick={expandAll}>expand all</button>
        <button onClick={collapseAll}>collapse all</button>
      </div>
      {
        blogs.map(blog => 
          <Blog blog={blog} key={blog.id} incrementLike={incrementLike} isExpanded={expand[blog.id]} toggleExpansionFor={toggleExpansionFor}/>
        )
      }
    </>
  )
}

export default BlogList