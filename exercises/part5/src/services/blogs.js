import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const getHttpConfig = () => {
  return { headers: { Authorization: token } }
}

const getAll = async () => {
  let result = []
  try {
    const request = await axios.get(baseUrl, getHttpConfig())
    result = request.data
  } catch (exception) {
    console.log(exception)
  }

  return result
}

const create = async (blog) => {
  let newBlog = null
  try {
    const result = await axios.post(baseUrl, blog, getHttpConfig())
    newBlog =  result.data
  } catch (exception) {
    console.log(exception)
  }

  return newBlog
}

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const blogService = {
  getAll, create, setToken
}

export default blogService