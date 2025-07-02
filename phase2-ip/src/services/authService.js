// src/services/authService.js - COMPLETE FIXED VERSION
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.log('🔧 AuthService API_URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔐 Auth Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log('✅ Auth Success:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ Auth Error:', error.response?.status, error.config?.url, error.response?.data);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

const authService = {
    // Register - map frontend 'name' to backend 'username'
    register: async (userData) => {
        const backendData = {
            username: userData.name, // ✅ Frontend sends 'name', backend expects 'username'
            email: userData.email,
            password: userData.password
        };
        console.log('📝 Register data:', backendData);
        return await api.post('/api/auth/register', backendData);
    },

    // Login
    login: async (userData) => {
        console.log('🔐 Login data:', userData);
        return await api.post('/api/auth/login', userData);
    },

    // Google Login
    googleLogin: async (googleData) => {
        console.log('🔐 Google login data:', googleData);
        return await api.post('/api/auth/google', googleData);
    },

    // Get current user
    getCurrentUser: async () => {
        return await api.get('/api/auth/me');
    },

    // Update profile
    updateProfile: async (profileData) => {
        // Handle both profile updates and password changes
        if (profileData.currentPassword) {
            // Password change
            return await api.put('/api/users/change-password', profileData);
        } else {
            // Profile update - map 'name' to 'username' if needed
            const backendData = { ...profileData };
            if (profileData.name) {
                backendData.username = profileData.name;
                delete backendData.name;
            }
            return await api.put('/api/users/profile', backendData);
        }
    },

    // Delete account
    deleteAccount: async () => {
        return await api.delete('/api/users/profile');
    },

    // Logout (clear local storage)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Get user
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;