// api/index.js
import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Matches your backend port
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending/receiving cookies
});

export default api;