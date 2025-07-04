const express = require('express');
const cors = require('cors');
const auth = require('../phase2-ip-backend/middlewares/auth');

// Import all controllers
const { register, login, googleLogin, getMe } = require('./controllers/authController');
const { getProfile, updateProfile, changePassword } = require('./controllers/userController');
const {
    searchMusic,
    getTrack,
    getAlbum,
    getArtist,
    getArtistTopTracks,
    getChart
} = require('./controllers/musicController');
const {
    getPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist
} = require('./controllers/playlistController');

// 🎵 UPDATED: Import the enhanced AI controller with playlist generation
const { smartSearch, generatePlaylist, testAI } = require('./controllers/aiController');

const app = express();

const corsOptions = {
    origin: [
        'https://hendyhuang.site',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.method === 'POST' && req.path.includes('/google')) {
        console.log('Google auth request received');
    }
    next();
});

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Deezer Music App API is running!' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/google', googleLogin);
app.get('/api/auth/me', auth, getMe);

// ============================================
// USER ROUTES
// ============================================
app.get('/api/users/profile', auth, getProfile);
app.put('/api/users/profile', auth, updateProfile);
app.put('/api/users/change-password', auth, changePassword);

// ============================================
// MUSIC ROUTES
// ============================================
app.get('/api/music/search', auth, searchMusic);
app.get('/api/music/chart', auth, getChart);
app.get('/api/music/track/:id', auth, getTrack);
app.get('/api/music/album/:id', auth, getAlbum);
app.get('/api/music/artist/:id', auth, getArtist);
app.get('/api/music/artist/:id/top', auth, getArtistTopTracks);

// ============================================
// PLAYLIST ROUTES
// ============================================
app.get('/api/playlists', auth, getPlaylists);
app.get('/api/playlists/:id', auth, getPlaylist);
app.post('/api/playlists', auth, createPlaylist);
app.put('/api/playlists/:id', auth, updatePlaylist);
app.delete('/api/playlists/:id', auth, deletePlaylist);
app.post('/api/playlists/:id/tracks', auth, addTrackToPlaylist);
app.delete('/api/playlists/:id/tracks/:trackId', auth, removeTrackFromPlaylist);

// ============================================
// 🎵 AI ROUTES (ENHANCED WITH PLAYLIST GENERATION)
// ============================================
app.get('/api/ai/test', testAI);
app.post('/api/ai/smart-search', auth, smartSearch);
app.post('/api/ai/generate-playlist', auth, generatePlaylist); // 🎵 NEW: AI Playlist Generator endpoint

console.log('✅ All endpoints added including AI Playlist Generator');

// 404 handler for API routes
// app.use('/api/*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: `Route ${req.path} not found`
//     });
// });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;