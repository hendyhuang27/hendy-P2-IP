import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api/playlists`,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const playlistService = {
    getPlaylists: async () => {
        try {
            const response = await api.get('/');
            return response.data;
        } catch (error) {
            console.error('Get playlists error:', error);
            throw error;
        }
    },

    getPlaylistById: async (id) => {
        try {
            const response = await api.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get playlist error:', error);
            throw error;
        }
    },

    createPlaylist: async (playlistData) => {
        try {
            const response = await api.post('/', playlistData);
            return response.data;
        } catch (error) {
            console.error('Create playlist error:', error);
            throw error;
        }
    },

    updatePlaylist: async (id, playlistData) => {
        try {
            const response = await api.put(`/${id}`, playlistData);
            return response.data;
        } catch (error) {
            console.error('Update playlist error:', error);
            throw error;
        }
    },

    deletePlaylist: async (id) => {
        try {
            const response = await api.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete playlist error:', error);
            throw error;
        }
    },

    addTrackToPlaylist: async (playlistId, trackData) => {
        try {
            const response = await api.post(`/${playlistId}/tracks`, trackData);
            return response.data;
        } catch (error) {
            console.error('Add track to playlist error:', error);
            throw error;
        }
    },

    removeTrackFromPlaylist: async (playlistId, trackId) => {
        try {
            const response = await api.delete(`/${playlistId}/tracks/${trackId}`);
            return response.data;
        } catch (error) {
            console.error('Remove track from playlist error:', error);
            throw error;
        }
    },
};

export default playlistService;