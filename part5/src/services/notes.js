import axios from 'axios'
const baseUrl = '/api/notes' // because both the front and back are being served on the same URL

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getHttpConfig = () => {
  return { headers: { Authorization: token } }
}

const getAll = async () => {
  const notes = await axios.get(baseUrl)
  return notes.data
}

const create = async (note) => {
  const response = await axios.post(baseUrl, note, getHttpConfig())
  return response.data
}

const update = async (id, note) => {
  const newNote = await axios.put(`${baseUrl}/${id}`, note, getHttpConfig())
  return newNote.data
}

const services = {
  getAll,
  create,
  update,
  setToken,
}

export default services