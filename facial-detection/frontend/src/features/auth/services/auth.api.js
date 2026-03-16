import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function register(userData={
  username: "",
  email: "",
  password: "",
}) {
  try {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
}

export async function login(credentials={
  email: "",
  password: "",
  username: ""
}) {
  try {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
}

export async function getMe() {
  try {
    const response = await apiClient.get('/api/auth/get-me');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
}

export async function logout() {
  try {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
}   



