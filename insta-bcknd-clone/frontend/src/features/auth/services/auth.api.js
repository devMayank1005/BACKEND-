import axios from "axios"

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true
})

export async function register(username,email,password) {
  try {
    const res = await api.post('/register',{
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
    const res = await api.post('/login',{
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
    const res = await api.post('/logout')

    console.log(res.data)
    return res.data

  } catch (error) {
    console.log(error)
  }
}

export async function getMe() {      

  try {
    const res = await api.get('/me')
    return res.data
  } catch (error) {
    console.log(error)
  }
}  