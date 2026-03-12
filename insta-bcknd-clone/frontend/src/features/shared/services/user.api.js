import axios from "axios"

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true
})

// For production, use relative URLs
const productionApi = axios.create({
  baseURL: '/api',
  withCredentials: true
})

// Use production API in production build
const apiClient = import.meta.env.PROD ? productionApi : api

export async function getUserProfile() {
    try {
        console.log('Making request to /users/profile')
        const response = await apiClient.get("/users/profile")
        console.log('Profile API response:', response.data)
        return response.data
    } catch (error) {
        console.error('Profile API error:', error.response?.data || error.message)
        throw error
    }
}
