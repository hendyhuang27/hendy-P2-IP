// src/services/musicService.js - FIXED VERSION
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.log('🎵 MusicService API_URL:', API_URL);

const api = axios.create({
    baseURL: `${API_URL}/api/music`, // ✅ Correct base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ FIXED: Always add Authorization header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('⚠️ No auth token found! Music API might fail.');
    }

    console.log('🚀 MusicService Request:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        params: config.params,
        hasAuth: !!config.headers.Authorization
    });

    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log('✅ MusicService Success:', {
            status: response.status,
            url: response.config.url,
            dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'N/A'
        });
        return response;
    },
    (error) => {
        console.error('❌ MusicService Error:', {
            status: error.response?.status,
            url: error.config?.url,
            fullURL: error.config?.baseURL + error.config?.url,
            message: error.response?.data?.message || error.message
        });
        return Promise.reject(error);
    }
);

const musicService = {
    // ✅ FIXED: Search for music with proper parameter handling
    searchMusic: async (query) => {
        try {
            console.log('🔍 Searching music:', query);

            // ✅ FIXED: Use params instead of query string
            const response = await api.get('/search', {
                params: { q: query }
            });

            console.log('🎵 Search results:', response.data);
            return response.data;
        } catch (error) {
            console.error('Music search error:', error);
            throw error;
        }
    },

    // Get music recommendations
    getRecommendations: async () => {
        try {
            console.log('🎵 Getting recommendations...');
            const response = await api.get('/recommendations');
            console.log('🎵 Recommendations:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get recommendations error:', error);
            throw error;
        }
    },

    // Get music chart
    getChart: async () => {
        try {
            console.log('🎵 Getting chart...');
            const response = await api.get('/chart');
            console.log('🎵 Chart data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get chart error:', error);
            throw error;
        }
    },

    // Get track by ID
    getTrackById: async (trackId) => {
        try {
            console.log('🎵 Getting track:', trackId);
            const response = await api.get(`/track/${trackId}`);
            return response.data;
        } catch (error) {
            console.error('Get track error:', error);
            throw error;
        }
    },

    // Get album by ID
    getAlbum: async (albumId) => {
        try {
            console.log('🎵 Getting album:', albumId);
            const response = await api.get(`/album/${albumId}`);
            return response.data;
        } catch (error) {
            console.error('Get album error:', error);
            throw error;
        }
    },

    // Get artist by ID
    getArtist: async (artistId) => {
        try {
            console.log('🎵 Getting artist:', artistId);
            const response = await api.get(`/artist/${artistId}`);
            return response.data;
        } catch (error) {
            console.error('Get artist error:', error);
            throw error;
        }
    },

    // Get artist top tracks
    getArtistTopTracks: async (artistId) => {
        try {
            console.log('🎵 Getting artist top tracks:', artistId);
            const response = await api.get(`/artist/${artistId}/top`);
            return response.data;
        } catch (error) {
            console.error('Get artist top tracks error:', error);
            throw error;
        }
    }
};

export default musicService;