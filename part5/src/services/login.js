import axio from "axios"
const baseUrl = '/api/login'

const login = async (credential) => {
  const response = await axio.post(baseUrl, credential)
  return response.data
}

export default { login }