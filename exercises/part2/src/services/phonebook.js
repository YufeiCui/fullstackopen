import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(response => {
    return response.data
  })
}

const addPhoneNumber = (person) => {
  return axios.post(baseUrl, person).then(response => {
    return response.data
  })
}

const deletePhoneNumber = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => {
    return response
  })
}

const updatePhoneNumber = (id, newPhoneNumber) => {
  return axios.put(`${baseUrl}/${id}`, newPhoneNumber).then(response => {
    return response.data
  })
}

const services = {
  getAll,
  deletePhoneNumber,
  addPhoneNumber,
  updatePhoneNumber
}

export default services