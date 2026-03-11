import axios from "axios"

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
})

export async function getUserProfile() {
    try {
        console.log('Making request to /users/profile')
        const response = await api.get("/users/profile")
        console.log('Profile API response:', response.data)
        return response.data
    } catch (error) {
        console.error('Profile API error:', error.response?.data || error.message)
        throw error
    }
}
