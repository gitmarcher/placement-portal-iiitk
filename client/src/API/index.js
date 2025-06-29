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

// Results Management API endpoints
export const resultsAPI = {
  // Start results process for a drive
  startResults: (driveId) => api.post(`/coordinator/drive/start-results/${driveId}`),
  
  // Get all round results for a drive
  getResults: (driveId) => api.get(`/coordinator/drive/results/${driveId}`),
  
  // Get eligible students for a specific round
  getRoundEligible: (driveId, roundNumber) => 
    api.get(`/coordinator/drive/round-eligible/${driveId}/${roundNumber}`),
  
  // Publish results for a specific round
  publishResults: (driveId, roundNumber, selectedStudents) =>
    api.post(`/coordinator/drive/publish-results/${driveId}/${roundNumber}`, {
      selected_students: selectedStudents
    }),
  
  // Reset results for a drive (admin function)
  resetResults: (driveId) => api.post(`/coordinator/drive/reset-results/${driveId}`)
};