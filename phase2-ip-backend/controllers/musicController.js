// controllers/musicController.js - FIXED DATA TRANSFORMATION
const axios = require('axios');

const searchMusic = async (req, res) => {
    try {
        const query = req.query.q || req.query.query || req.body.query;

        console.log('🎵 Backend searchMusic called with:', {
            queryParam: req.query.q,
            finalQuery: query
        });

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const rapidApiKey = process.env.RAPIDAPI_KEY;
        if (!rapidApiKey) {
            return res.status(500).json({
                success: false,
                message: 'Music service configuration error'
            });
        }

        const options = {
            method: 'GET',
            url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
            params: {
                q: query.trim()
            },
            headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            },
            timeout: 15000
        };

        console.log('🚀 Making RapidAPI request...');
        const response = await axios.request(options);

        console.log('✅ Raw API Response:', {
            status: response.status,
            hasData: !!response.data,
            dataKeys: response.data ? Object.keys(response.data) : [],
            firstTrack: response.data?.data?.[0] || 'No tracks'
        });

        // ✅ FIXED: Better data extraction
        let tracks = [];

        if (response.data && response.data.data && Array.isArray(response.data.data)) {
            tracks = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
            tracks = response.data;
        } else {
            console.log('⚠️ Unexpected API response structure:', response.data);
            return res.json({
                success: true,
                data: [],
                total: 0,
                query: query.trim(),
                message: 'No results found'
            });
        }

        console.log('🎵 Processing', tracks.length, 'tracks...');

        // ✅ FIXED: Better data transformation with detailed logging
        const transformedTracks = tracks.map((track, index) => {
            // Log first few tracks for debugging
            if (index < 3) {
                console.log(`Track ${index + 1} raw data:`, {
                    id: track.id,
                    title: track.title,
                    title_short: track.title_short,
                    artist: track.artist,
                    album: track.album,
                    preview: track.preview,
                    duration: track.duration
                });
            }

            const transformed = {
                id: track.id || `track_${index}`,
                title: track.title || track.title_short || 'Unknown Title',
                artist: track.artist?.name || track.artist || 'Unknown Artist',
                album: track.album?.title || track.album || 'Unknown Album',
                duration: track.duration || 0,
                preview: track.preview || null,

                // ✅ FIXED: Multiple image size options
                image: track.album?.cover_xl ||
                    track.album?.cover_big ||
                    track.album?.cover_medium ||
                    track.album?.cover_small ||
                    track.album?.cover ||
                    null,

                // Additional fields for compatibility
                artists: track.artist?.name || track.artist || 'Unknown Artist',
                name: track.title || track.title_short || 'Unknown Title',
                cover: track.album?.cover_medium || track.album?.cover_small || null,

                // Additional metadata
                explicit: track.explicit_lyrics || false,
                rank: track.rank || null,
                link: track.link || null
            };

            // Log transformation for first few tracks
            if (index < 3) {
                console.log(`Track ${index + 1} transformed:`, transformed);
            }

            return transformed;
        });

        console.log('✅ Transformation complete:', {
            originalCount: tracks.length,
            transformedCount: transformedTracks.length,
            sampleTitles: transformedTracks.slice(0, 3).map(t => t.title),
            sampleArtists: transformedTracks.slice(0, 3).map(t => t.artist),
            hasImages: transformedTracks.slice(0, 3).map(t => !!t.image)
        });

        return res.json({
            success: true,
            data: transformedTracks,
            total: transformedTracks.length,
            query: query.trim()
        });

    } catch (error) {
        console.error('❌ Music search error:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status
        });

        if (error.response) {
            return res.status(error.response.status || 500).json({
                success: false,
                message: `Music service error: ${error.response.data?.message || error.message}`,
                error: process.env.NODE_ENV === 'development' ? error.response.data : undefined
            });
        } else if (error.code === 'ECONNABORTED') {
            return res.status(408).json({
                success: false,
                message: 'Music search timeout. Please try again.'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Internal server error during music search',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

// ✅ Get track by ID with better error handling
const getTrack = async (req, res) => {
    try {
        const trackId = req.params.id;

        if (!trackId) {
            return res.status(400).json({
                success: false,
                message: 'Track ID is required'
            });
        }

        const rapidApiKey = process.env.RAPIDAPI_KEY;
        if (!rapidApiKey) {
            return res.status(500).json({
                success: false,
                message: 'Music service configuration error'
            });
        }

        const options = {
            method: 'GET',
            url: `https://deezerdevs-deezer.p.rapidapi.com/track/${trackId}`,
            headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            },
            timeout: 15000
        };

        const response = await axios.request(options);
        const track = response.data;

        console.log('🎵 Track details raw:', track);

        const transformedTrack = {
            id: track.id,
            title: track.title || track.title_short || 'Unknown Title',
            artist: track.artist?.name || 'Unknown Artist',
            album: track.album?.title || 'Unknown Album',
            duration: track.duration || 0,
            preview: track.preview || null,
            image: track.album?.cover_xl ||
                track.album?.cover_big ||
                track.album?.cover_medium ||
                track.album?.cover_small || null,
            artists: track.artist?.name,
            name: track.title,
            cover: track.album?.cover_medium,
            explicit: track.explicit_lyrics || false,
            link: track.link || null
        };

        return res.json({
            success: true,
            data: transformedTrack
        });

    } catch (error) {
        console.error('❌ Get track error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to get track',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ✅ Keep other functions the same but with better error handling
const getChart = async (req, res) => {
    try {
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        if (!rapidApiKey) {
            return res.status(500).json({
                success: false,
                message: 'Music service configuration error'
            });
        }

        const limit = req.query.limit || 50;

        const options = {
            method: 'GET',
            url: 'https://deezerdevs-deezer.p.rapidapi.com/chart',
            params: {
                limit: Math.min(limit, 100)
            },
            headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            },
            timeout: 15000
        };

        const response = await axios.request(options);

        let tracks = [];
        if (response.data && response.data.tracks && Array.isArray(response.data.tracks.data)) {
            tracks = response.data.tracks.data;
        }

        const transformedTracks = tracks.map(track => ({
            id: track.id,
            title: track.title || track.title_short || 'Unknown Title',
            artist: track.artist?.name || 'Unknown Artist',
            album: track.album?.title || 'Unknown Album',
            duration: track.duration || 0,
            preview: track.preview || null,
            image: track.album?.cover_xl ||
                track.album?.cover_big ||
                track.album?.cover_medium ||
                track.album?.cover_small || null,
            artists: track.artist?.name,
            name: track.title,
            cover: track.album?.cover_medium,
            position: track.position || null
        }));

        return res.json({
            success: true,
            data: transformedTracks,
            total: transformedTracks.length
        });

    } catch (error) {
        console.error('❌ Chart error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to get chart',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Placeholder functions for other endpoints
const getAlbum = async (req, res) => {
    try {
        const albumId = req.params.id;

        const rapidApiKey = process.env.RAPIDAPI_KEY;
        if (!rapidApiKey) {
            return res.status(500).json({
                success: false,
                message: 'Music service configuration error'
            });
        }

        const options = {
            method: 'GET',
            url: `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`,
            headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            },
            timeout: 15000
        };

        const response = await axios.request(options);
        const album = response.data;

        const transformedAlbum = {
            id: album.id,
            title: album.title || 'Unknown Album',
            artist: album.artist?.name || 'Unknown Artist',
            releaseDate: album.release_date || null,
            trackCount: album.nb_tracks || 0,
            duration: album.duration || 0,
            image: album.cover_xl || album.cover_big || album.cover_medium || album.cover_small || null,
            tracks: album.tracks?.data?.map(track => ({
                id: track.id,
                title: track.title,
                artist: track.artist?.name || album.artist?.name,
                duration: track.duration,
                preview: track.preview
            })) || []
        };

        return res.json({
            success: true,
            data: transformedAlbum
        });

    } catch (error) {
        console.error('❌ Get album error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to get album',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getArtist = async (req, res) => {
    return res.json({
        success: true,
        data: {
            id: req.params.id,
            name: "Artist endpoint not fully implemented",
            picture: null
        }
    });
};

const getArtistTopTracks = async (req, res) => {
    return res.json({
        success: true,
        data: [],
        message: "Artist top tracks endpoint not fully implemented"
    });
};

module.exports = {
    searchMusic,
    getTrack,
    getAlbum,
    getArtist,
    getArtistTopTracks,
    getChart
};