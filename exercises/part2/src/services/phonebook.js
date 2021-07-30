import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl)
    .then(response => {
      return response.data
    })
    .catch(error => {
      return error
    })
}

const addPhoneNumber = (person) => {
  return axios.post(baseUrl, person).then(response => {
    return response.data
  }).catch(error => {
    return error
  })
}

const deletePhoneNumber = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => {
    return response
  }).catch(error => {
    return error
  })
}

const updatePhoneNumber = (id, newPhoneNumber) => {
  return axios.put(`${baseUrl}/${id}`, newPhoneNumber).then(response => {
    return response.data
  }).catch(error => {
    return error
  })
}

const services = {
  getAll,
  deletePhoneNumber,
  addPhoneNumber,
  updatePhoneNumber
}

export default services