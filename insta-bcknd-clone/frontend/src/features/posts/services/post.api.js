import axios from "axios"

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true
})

// For production, use relative URLs
const productionApi = axios.create({
    baseURL: '',
    withCredentials: true
})

// Use production API in production build
const apiClient = import.meta.env.PROD ? productionApi : api



export async function getFeed() {
    const response = await apiClient.get('/api/posts/feed')
    return response.data
}


export async function createPost(imageFile, caption) {

    const formData = new FormData()

    formData.append("image", imageFile)
    formData.append('caption', caption)

    const response = await apiClient.post("/api/posts", formData)

    return response.data
}

export async function likePost(postId) {
    const response = await apiClient.post("/api/posts/like/" + postId)
    return response.data
}

export async function unLikePost(postId) {
    const response = await apiClient.post("/api/posts/unlike/" + postId)
    return response.data
}

export async function getComments(postId) {
    const response = await apiClient.get(`/api/posts/${postId}/comments`)
    return response.data
}

export async function addComment(postId, text) {
    const response = await apiClient.post(`/api/posts/${postId}/comments`, { text })
    return response.data
}