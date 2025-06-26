// src/store/slices/musicSlice.js - FIXED VERSION
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.log('🎵 MusicSlice API_URL:', API_URL);

// Configure axios
const api = axios.create({
    baseURL: `${API_URL}/api/music`, // ✅ FIXED: Correct path
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
        console.warn('⚠️ No auth token found in Redux! Music API might fail.');
    }

    console.log('🚀 Redux Music API Request:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        params: config.params,
        hasAuth: !!config.headers.Authorization
    });

    return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('✅ Redux Music API Success:', {
            status: response.status,
            url: response.config.url,
            dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'N/A',
            hasData: !!response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ Redux Music API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            fullURL: error.config?.baseURL + error.config?.url,
            message: error.response?.data?.message || error.message
        });
        return Promise.reject(error);
    }
);

// ✅ FIXED: Async thunks with proper error handling
export const searchMusic = createAsyncThunk(
    'music/searchMusic',
    async (query, { rejectWithValue }) => {
        try {
            console.log('🔍 Redux searchMusic for:', query);

            // ✅ FIXED: Use params object instead of query string
            const response = await api.get('/search', {
                params: { q: query }
            });

            console.log('✅ Redux search response:', response.data);

            // Handle different response structures
            if (response.data.success === false) {
                throw new Error(response.data.message || 'Search failed');
            }

            return response.data;
        } catch (error) {
            console.error('❌ Redux searchMusic error:', error);
            const message = error.response?.data?.message || error.message || 'Music search failed';
            return rejectWithValue(message);
        }
    }
);

export const getRecommendations = createAsyncThunk(
    'music/getRecommendations',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🎯 Redux getRecommendations...');

            // Try recommendations endpoint first, fallback to chart
            let response;
            try {
                response = await api.get('/recommendations');
            } catch (err) {
                console.log('🔄 Recommendations endpoint failed, trying chart...');
                response = await api.get('/chart');
            }

            console.log('✅ Redux recommendations response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Redux getRecommendations error:', error);
            const message = error.response?.data?.message || error.message || 'Failed to get recommendations';
            return rejectWithValue(message);
        }
    }
);

export const getChart = createAsyncThunk(
    'music/getChart',
    async (limit = 50, { rejectWithValue }) => {
        try {
            console.log('📊 Redux getChart...');

            const response = await api.get('/chart', {
                params: { limit }
            });

            console.log('✅ Redux chart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Redux getChart error:', error);
            const message = error.response?.data?.message || error.message || 'Failed to get chart';
            return rejectWithValue(message);
        }
    }
);

export const getTrackById = createAsyncThunk(
    'music/getTrackById',
    async (trackId, { rejectWithValue }) => {
        try {
            console.log('🎵 Redux getTrackById:', trackId);

            const response = await api.get(`/track/${trackId}`);

            console.log('✅ Redux track response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Redux getTrackById error:', error);
            const message = error.response?.data?.message || error.message || 'Failed to get track';
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    // Search
    searchResults: [],
    searchQuery: '',
    searchLoading: false,
    searchError: null,

    // Recommendations
    recommendations: [],
    recommendationsLoading: false,
    recommendationsError: null,

    // Chart
    chart: [],
    chartLoading: false,
    chartError: null,

    // Current track and player
    currentTrack: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,
    volume: 1,
    currentTime: 0,
    duration: 0,
    shuffle: false,
    repeat: 'none', // 'none', 'one', 'all'

    // General loading and error (for backward compatibility)
    loading: false,
    error: null
};

const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {
        // Player controls
        setCurrentTrack: (state, action) => {
            state.currentTrack = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
        },
        setQueue: (state, action) => {
            state.queue = action.payload;
            state.currentIndex = 0;
        },
        addToQueue: (state, action) => {
            state.queue.push(action.payload);
        },
        removeFromQueue: (state, action) => {
            const index = action.payload;
            state.queue.splice(index, 1);
            if (state.currentIndex >= index && state.currentIndex > 0) {
                state.currentIndex -= 1;
            }
        },
        setCurrentIndex: (state, action) => {
            state.currentIndex = action.payload;
            if (state.queue[action.payload]) {
                state.currentTrack = state.queue[action.payload];
            }
        },
        nextTrack: (state) => {
            if (state.shuffle) {
                const randomIndex = Math.floor(Math.random() * state.queue.length);
                state.currentIndex = randomIndex;
            } else {
                state.currentIndex = (state.currentIndex + 1) % state.queue.length;
            }

            if (state.queue[state.currentIndex]) {
                state.currentTrack = state.queue[state.currentIndex];
            }
        },
        previousTrack: (state) => {
            if (state.shuffle) {
                const randomIndex = Math.floor(Math.random() * state.queue.length);
                state.currentIndex = randomIndex;
            } else {
                state.currentIndex = state.currentIndex === 0
                    ? state.queue.length - 1
                    : state.currentIndex - 1;
            }

            if (state.queue[state.currentIndex]) {
                state.currentTrack = state.queue[state.currentIndex];
            }
        },
        setVolume: (state, action) => {
            state.volume = Math.max(0, Math.min(1, action.payload));
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },
        setDuration: (state, action) => {
            state.duration = action.payload;
        },
        setShuffle: (state, action) => {
            state.shuffle = action.payload;
        },
        setRepeat: (state, action) => {
            state.repeat = action.payload;
        },

        // Search
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchQuery = '';
            state.searchError = null;
        },

        // Error handling
        clearError: (state) => {
            state.error = null;
            state.searchError = null;
            state.recommendationsError = null;
            state.chartError = null;
        },

        // Reset player
        resetPlayer: (state) => {
            state.currentTrack = null;
            state.isPlaying = false;
            state.queue = [];
            state.currentIndex = 0;
            state.currentTime = 0;
            state.duration = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Search Music
            .addCase(searchMusic.pending, (state) => {
                state.searchLoading = true;
                state.loading = true; // Backward compatibility
                state.searchError = null;
                state.error = null;
            })
            .addCase(searchMusic.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.loading = false;

                // Handle different response structures
                const responseData = action.payload;

                if (responseData.data) {
                    // Standard format: { success: true, data: [...] }
                    state.searchResults = responseData.data;
                } else if (Array.isArray(responseData)) {
                    // Direct array format
                    state.searchResults = responseData;
                } else if (responseData.tracks) {
                    // Nested tracks format
                    state.searchResults = responseData.tracks;
                } else {
                    // Fallback
                    state.searchResults = [];
                }

                state.searchError = null;
                state.error = null;

                console.log('✅ Redux search results stored:', state.searchResults.length);
            })
            .addCase(searchMusic.rejected, (state, action) => {
                state.searchLoading = false;
                state.loading = false;
                state.searchError = action.payload;
                state.error = action.payload;
                state.searchResults = [];

                console.log('❌ Redux search rejected:', action.payload);
            })

            // Get Recommendations
            .addCase(getRecommendations.pending, (state) => {
                state.recommendationsLoading = true;
                state.recommendationsError = null;
            })
            .addCase(getRecommendations.fulfilled, (state, action) => {
                state.recommendationsLoading = false;

                const responseData = action.payload;

                if (responseData.data) {
                    state.recommendations = responseData.data;
                } else if (Array.isArray(responseData)) {
                    state.recommendations = responseData;
                } else if (responseData.tracks) {
                    state.recommendations = responseData.tracks;
                } else {
                    state.recommendations = [];
                }

                state.recommendationsError = null;
            })
            .addCase(getRecommendations.rejected, (state, action) => {
                state.recommendationsLoading = false;
                state.recommendationsError = action.payload;
            })

            // Get Chart
            .addCase(getChart.pending, (state) => {
                state.chartLoading = true;
                state.chartError = null;
            })
            .addCase(getChart.fulfilled, (state, action) => {
                state.chartLoading = false;

                const responseData = action.payload;

                if (responseData.data) {
                    state.chart = responseData.data;
                } else if (Array.isArray(responseData)) {
                    state.chart = responseData;
                } else if (responseData.tracks) {
                    state.chart = responseData.tracks;
                } else {
                    state.chart = [];
                }

                state.chartError = null;
            })
            .addCase(getChart.rejected, (state, action) => {
                state.chartLoading = false;
                state.chartError = action.payload;
            })

            // Get Track by ID
            .addCase(getTrackById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTrackById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // You might want to add the track to current track or do something else
            })
            .addCase(getTrackById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    setCurrentTrack,
    setIsPlaying,
    togglePlay,
    setQueue,
    addToQueue,
    removeFromQueue,
    setCurrentIndex,
    nextTrack,
    previousTrack,
    setVolume,
    setCurrentTime,
    setDuration,
    setShuffle,
    setRepeat,
    setSearchQuery,
    clearSearchResults,
    clearError,
    resetPlayer
} = musicSlice.actions;

export default musicSlice.reducer;