// src/store/slices/playlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Configure axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Async thunks
export const fetchPlaylists = createAsyncThunk(
    'playlist/fetchPlaylists',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/playlists');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch playlists';
            return rejectWithValue(message);
        }
    }
);

export const createPlaylist = createAsyncThunk(
    'playlist/createPlaylist',
    async (playlistData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/playlists', playlistData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to create playlist';
            return rejectWithValue(message);
        }
    }
);

export const updatePlaylist = createAsyncThunk(
    'playlist/updatePlaylist',
    async ({ id, playlistData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/playlists/${id}`, playlistData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to update playlist';
            return rejectWithValue(message);
        }
    }
);

export const deletePlaylist = createAsyncThunk(
    'playlist/deletePlaylist',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/playlists/${id}`);
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to delete playlist';
            return rejectWithValue(message);
        }
    }
);

export const addTrackToPlaylist = createAsyncThunk(
    'playlist/addTrackToPlaylist',
    async ({ playlistId, trackData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/playlists/${playlistId}/tracks`, trackData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to add track to playlist';
            return rejectWithValue(message);
        }
    }
);

export const removeTrackFromPlaylist = createAsyncThunk(
    'playlist/removeTrackFromPlaylist',
    async ({ playlistId, trackId }, { rejectWithValue }) => {
        try {
            await api.delete(`/api/playlists/${playlistId}/tracks/${trackId}`);
            return { playlistId, trackId };
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to remove track from playlist';
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    playlists: [],
    currentPlaylist: null,
    loading: false,
    error: null
};

const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentPlaylist: (state, action) => {
            state.currentPlaylist = action.payload;
        },
        clearCurrentPlaylist: (state) => {
            state.currentPlaylist = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Playlists
            .addCase(fetchPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = action.payload.playlists || action.payload;
                state.error = null;
            })
            .addCase(fetchPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Playlist
            .addCase(createPlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists.push(action.payload.playlist || action.payload);
                state.error = null;
            })
            .addCase(createPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Playlist
            .addCase(updatePlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlaylist.fulfilled, (state, action) => {
                state.loading = false;
                const updatedPlaylist = action.payload.playlist || action.payload;
                const index = state.playlists.findIndex(p => p.id === updatedPlaylist.id);
                if (index !== -1) {
                    state.playlists[index] = updatedPlaylist;
                }
                if (state.currentPlaylist && state.currentPlaylist.id === updatedPlaylist.id) {
                    state.currentPlaylist = updatedPlaylist;
                }
                state.error = null;
            })
            .addCase(updatePlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Playlist
            .addCase(deletePlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = state.playlists.filter(p => p.id !== action.payload);
                if (state.currentPlaylist && state.currentPlaylist.id === action.payload) {
                    state.currentPlaylist = null;
                }
                state.error = null;
            })
            .addCase(deletePlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Track to Playlist
            .addCase(addTrackToPlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTrackToPlaylist.fulfilled, (state, action) => {
                state.loading = false;
                const updatedPlaylist = action.payload.playlist || action.payload;
                const index = state.playlists.findIndex(p => p.id === updatedPlaylist.id);
                if (index !== -1) {
                    state.playlists[index] = updatedPlaylist;
                }
                if (state.currentPlaylist && state.currentPlaylist.id === updatedPlaylist.id) {
                    state.currentPlaylist = updatedPlaylist;
                }
                state.error = null;
            })
            .addCase(addTrackToPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove Track from Playlist
            .addCase(removeTrackFromPlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeTrackFromPlaylist.fulfilled, (state, action) => {
                state.loading = false;
                const { playlistId, trackId } = action.payload;
                const playlist = state.playlists.find(p => p.id === playlistId);
                if (playlist && playlist.tracks) {
                    playlist.tracks = playlist.tracks.filter(t => t.id !== trackId);
                }
                if (state.currentPlaylist && state.currentPlaylist.id === playlistId && state.currentPlaylist.tracks) {
                    state.currentPlaylist.tracks = state.currentPlaylist.tracks.filter(t => t.id !== trackId);
                }
                state.error = null;
            })
            .addCase(removeTrackFromPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, setCurrentPlaylist, clearCurrentPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;