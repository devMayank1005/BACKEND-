import axios from "axios"

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  withCredentials: true
})

// For production, use relative URLs
const productionApi = axios.create({
  baseURL: '/api/auth',
  withCredentials: true
})

// Use production API in production build
const apiClient = import.meta.env.PROD ? productionApi : api

export default apiClient

export async function register(username,email,password) {
  try {
    const res = await apiClient.post('/register',{
      username,
      email,
      password
    })

    console.log(res.data)
    return res.data

  } catch (error) {
    console.log(error.response.data.message)
    
  }
}

export async function login(username,password) {

  try {
    const res = await apiClient.post('/login',{
      username,
      password
    })

    console.log(res.data)
    return res.data

  } catch (error) {
    console.log(error)
  }
}

export async function logout() {

  try {
    const res = await apiClient.post('/logout')

    console.log(res.data)
    return res.data

  } catch (error) {
    console.log(error)
  }
}

export async function getMe() {      

  try {
    const res = await apiClient.get('/get-me')
    return res.data
  } catch (error) {
    console.log(error)
  }
}  