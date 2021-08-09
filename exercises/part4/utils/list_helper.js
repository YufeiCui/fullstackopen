const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const first = blogs[0]

  return blogs.reduce((acc, curr) => curr.likes > acc.likes ? curr : acc, first)
}

const keyOfMaxValuedObject = (object) => {
  return Object.keys(object).reduce(
    (curr, acc) => object[curr] > object[acc] ? curr : acc
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogsCount = {}
  blogs.forEach(blog => {
    const count = blogsCount[blog.author] || 0
    blogsCount[blog.author] = count + 1
  })

  const authorWithMostBlogs = keyOfMaxValuedObject(blogsCount)

  return {
    author: authorWithMostBlogs,
    blogs: blogsCount[authorWithMostBlogs]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesCount = {}
  blogs.forEach(blog => {
    const count = likesCount[blog.author] || 0
    likesCount[blog.author] = count + blog.likes
  })

  const authorWithMostLikes = keyOfMaxValuedObject(likesCount)

  return {
    author: authorWithMostLikes,
    likes: likesCount[authorWithMostLikes]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}