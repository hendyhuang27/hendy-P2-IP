// src/services/authService.js - FIXED VERSION
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with CORRECT base URL
const api = axios.create({
    baseURL: `${API_URL}/api/auth`, // ✅ FIXED: Changed from /api/users to /api/auth
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔐 Auth Request:', config.method?.toUpperCase(), config.url);
    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('✅ Auth Success:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ Auth Error:', error.response?.status, error.config?.url);
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optionally redirect to login
        }
        return Promise.reject(error);
    }
);

const authService = {
    // Regular login - FIXED endpoint
    login: async (userData) => {
        return await api.post('/login', userData); // ✅ Will call /api/auth/login
    },

    // Register - FIXED endpoint
    register: async (userData) => {
        return await api.post('/register', userData); // ✅ Will call /api/auth/register
    },

    // Google login - FIXED endpoint
    googleLogin: async (googleData) => {
        return await api.post('/google', googleData); // ✅ Will call /api/auth/google
    },

    // Get current user - FIXED endpoint
    getCurrentUser: async () => {
        return await api.get('/me'); // ✅ Will call /api/auth/me
    },

    // Update profile - FIXED
    updateProfile: async (profileData) => {
        return await api.put('/profile', profileData); // ✅ Simplified
    },

    // Delete account - FIXED
    deleteAccount: async () => {
        return await api.delete('/account'); // ✅ Simplified
    },

    // Logout (clear token)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Get stored token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Get stored user
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;