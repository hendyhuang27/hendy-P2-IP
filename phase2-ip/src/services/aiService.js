// frontend/src/services/aiService.js - ENHANCED WITH PLAYLIST GENERATION
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.log('🤖 AI Service API_URL:', API_URL);

const api = axios.create({
    baseURL: `${API_URL}/api/ai`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('🚀 AI API Request:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        hasAuth: !!config.headers.Authorization
    });

    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log('✅ AI API Success:', {
            status: response.status,
            url: response.config.url,
            hasData: !!response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ AI API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data?.message || error.message
        });
        return Promise.reject(error);
    }
);

const aiService = {
    // Test AI connection
    testConnection: async () => {
        try {
            console.log('🧪 Testing AI connection...');
            const response = await api.get('/test');
            return response.data;
        } catch (error) {
            console.error('AI connection test failed:', error);
            throw error;
        }
    },

    // Smart search with natural language
    smartSearch: async (query) => {
        try {
            console.log('🤖 AI Smart Search:', query);
            const response = await api.post('/smart-search', { query });
            return response.data;
        } catch (error) {
            console.error('Smart search error:', error);
            throw error;
        }
    },

    // 🎵 NEW: AI Playlist Generator
    generatePlaylist: async (description, options = {}) => {
        try {
            console.log('🎵 AI Playlist Generator:', description, options);

            const requestData = {
                query: description,
                trackCount: options.trackCount || 15,
                saveName: options.saveName || null
            };

            const response = await api.post('/generate-playlist', requestData);
            console.log('✅ AI Playlist Generated:', response.data);

            return response.data;
        } catch (error) {
            console.error('❌ AI Playlist generation failed:', error);
            throw error;
        }
    },

    // 🎵 NEW: Generate playlist preview (without saving)
    generatePlaylistPreview: async (description, trackCount = 15) => {
        try {
            console.log('👀 AI Playlist Preview:', description);

            const response = await aiService.generatePlaylist(description, {
                trackCount,
                saveName: null // Don't save, just preview
            });

            return response;
        } catch (error) {
            console.error('❌ AI Playlist preview failed:', error);
            throw error;
        }
    },

    // 🎵 NEW: Generate and save playlist
    generateAndSavePlaylist: async (description, playlistName, trackCount = 15) => {
        try {
            console.log('💾 AI Generate & Save Playlist:', description, playlistName);

            const response = await aiService.generatePlaylist(description, {
                trackCount,
                saveName: playlistName
            });

            return response;
        } catch (error) {
            console.error('❌ AI Generate & Save playlist failed:', error);
            throw error;
        }
    }
};

export default aiService;