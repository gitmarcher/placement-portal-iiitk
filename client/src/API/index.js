// api/index.js
import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Updated to match your backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;