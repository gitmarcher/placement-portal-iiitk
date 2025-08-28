// src/api/driveApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchDrives = async (page = 1, limit = 10, filters = {}, searchTerm = "") => {
    try {
        const params = new URLSearchParams({
            page,
            limit,
        });

        if (searchTerm) {
            params.append('searchRole', searchTerm);
        }

        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (value && (!Array.isArray(value) || value.length > 0)) {
                params.append(key, Array.isArray(value) ? value.join(',') : value);
            }
        });

        const response = await axios.get(`${API_URL}/api/student/drive/all?${params.toString()}`, {
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching drives:', error);
        throw error;
    }
};