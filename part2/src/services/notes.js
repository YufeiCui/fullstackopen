import axios from 'axios'
const baseUrl = '/api/notes' // because both the front and back are being served on the same URL

const getAll = () => {
  return axios.get(baseUrl).then(response => {
    return response.data
  })
}

const create = (note) => {
  return axios.post(baseUrl, note).then(response => {
    return response.data
  })
}

const update = (id, note) => {
  return axios.put(`${baseUrl}/${id}`, note).then(response => {
    return response.data
  })
}

const services = {
  getAll,
  create,
  update,
}

export default services