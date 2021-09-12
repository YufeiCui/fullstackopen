const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

const listWithOneBlog = helper.listWithOneBlog
const blogs = helper.blogs

describe('dummy', () => {
  const dummy = listHelper.dummy

  test('with an empty list of blogs', () => {
    expect(dummy([])).toBe(1)
  })
})

describe('totalLikes', () => {
  const totalLikes = listHelper.totalLikes

  test('of empty list', () => {
    const result = totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs', () => {
    const result = totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favouriteBlog', () => {
  const favouriteBlog = listHelper.favouriteBlog

  test('when list has no blogs', () => {
    const result = favouriteBlog([])

    expect(result).toBe(null)
  })

  test('when list has one blog', () => {
    const result = favouriteBlog(listWithOneBlog)

    expect(result).toEqual(listWithOneBlog[0])
  })

  test('when list has multiple blogs', () => {
    const result = favouriteBlog(blogs)

    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    })
  })
})

describe('mostLikes', () => {
  const mostBlogs = listHelper.mostBlogs

  test('of empty list', () => {
    expect(mostBlogs([])).toBe(null)
  })

  test('when list has only one blog, equals the likes of that', () => {
    expect(mostBlogs(listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has multiple blogs', () => {
    expect(mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('mostBlogs', () => {
  const mostLikes = listHelper.mostLikes

  test('of empty list', () => {
    expect(mostLikes([])).toBe(null)
  })

  test('when list has only one blog, equals the likes of that', () => {
    expect(mostLikes(listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has multiple blogs', () => {
    expect(mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})