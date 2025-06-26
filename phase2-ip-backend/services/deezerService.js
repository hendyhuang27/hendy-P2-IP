const axios = require('axios');

const DEEZER_API_URL = process.env.DEEZER_API_URL || 'https://api.deezer.com';

class DeezerService {
    // Search for tracks
    static async searchTracks(query, limit = 25) {
        try {
            console.log(`🔍 Searching tracks: "${query}" (limit: ${limit})`);

            const response = await axios.get(`${DEEZER_API_URL}/search`, {
                params: { q: query, limit },
                timeout: 10000 // 10 second timeout
            });

            console.log(`✅ Search successful: ${response.data?.data?.length || 0} tracks found`);

            if (!response.data || !response.data.data) {
                console.log('⚠️ No data in response, returning empty result');
                return { data: [] };
            }

            return response.data;
        } catch (error) {
            console.error(`❌ Deezer search error for "${query}":`, error.message);
            return { data: [] }; // Return empty data instead of throwing
        }
    }

    // Get track by ID
    static async getTrack(trackId) {
        try {
            console.log(`🎵 Getting track: ${trackId}`);

            const response = await axios.get(`${DEEZER_API_URL}/track/${trackId}`, {
                timeout: 10000
            });

            console.log(`✅ Track fetched: ${response.data?.title || 'Unknown'}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Deezer get track error for ID ${trackId}:`, error.message);
            throw new Error('Failed to get track');
        }
    }

    // Get album by ID
    static async getAlbum(albumId) {
        try {
            console.log(`💿 Getting album: ${albumId}`);

            const response = await axios.get(`${DEEZER_API_URL}/album/${albumId}`, {
                timeout: 10000
            });

            console.log(`✅ Album fetched: ${response.data?.title || 'Unknown'}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Deezer get album error for ID ${albumId}:`, error.message);
            throw new Error('Failed to get album');
        }
    }

    // Get artist by ID
    static async getArtist(artistId) {
        try {
            console.log(`🎤 Getting artist: ${artistId}`);

            const response = await axios.get(`${DEEZER_API_URL}/artist/${artistId}`, {
                timeout: 10000
            });

            console.log(`✅ Artist fetched: ${response.data?.name || 'Unknown'}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Deezer get artist error for ID ${artistId}:`, error.message);
            throw new Error('Failed to get artist');
        }
    }

    // Get artist's top tracks
    static async getArtistTopTracks(artistId, limit = 50) {
        try {
            console.log(`🔥 Getting top tracks for artist: ${artistId}`);

            const response = await axios.get(`${DEEZER_API_URL}/artist/${artistId}/top`, {
                params: { limit },
                timeout: 10000
            });

            console.log(`✅ Top tracks fetched: ${response.data?.data?.length || 0} tracks`);

            if (!response.data || !response.data.data) {
                return { data: [] };
            }

            return response.data;
        } catch (error) {
            console.error(`❌ Deezer get artist top tracks error for ID ${artistId}:`, error.message);
            throw new Error('Failed to get artist top tracks');
        }
    }

    // Get chart (popular tracks)
    static async getChart(limit = 50) {
        try {
            console.log(`📈 Getting chart (limit: ${limit})`);

            const response = await axios.get(`${DEEZER_API_URL}/chart`, {
                params: { limit },
                timeout: 15000 // Longer timeout for chart
            });

            console.log(`✅ Chart fetched: ${response.data?.tracks?.data?.length || 0} tracks`);

            // Chart API returns data in tracks.data format
            if (response.data && response.data.tracks && response.data.tracks.data) {
                return { data: response.data.tracks.data };
            }

            // Fallback if structure is different
            if (response.data && response.data.data) {
                return response.data;
            }

            console.log('⚠️ Unexpected chart response structure:', Object.keys(response.data || {}));
            return { data: [] };

        } catch (error) {
            console.error('❌ Deezer get chart error:', error.message);

            // Check if it's a network/timeout error
            if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                console.log('🌐 Network connectivity issue detected');
            }

            return { data: [] }; // Return empty data instead of throwing
        }
    }

    // Search artists
    static async searchArtists(query, limit = 25) {
        try {
            console.log(`🎤 Searching artists: "${query}"`);

            const response = await axios.get(`${DEEZER_API_URL}/search/artist`, {
                params: { q: query, limit },
                timeout: 10000
            });

            console.log(`✅ Artists search successful: ${response.data?.data?.length || 0} artists`);

            if (!response.data || !response.data.data) {
                return { data: [] };
            }

            return response.data;
        } catch (error) {
            console.error(`❌ Deezer search artists error for "${query}":`, error.message);
            return { data: [] };
        }
    }

    // Search albums
    static async searchAlbums(query, limit = 25) {
        try {
            console.log(`💿 Searching albums: "${query}"`);

            const response = await axios.get(`${DEEZER_API_URL}/search/album`, {
                params: { q: query, limit },
                timeout: 10000
            });

            console.log(`✅ Albums search successful: ${response.data?.data?.length || 0} albums`);

            if (!response.data || !response.data.data) {
                return { data: [] };
            }

            return response.data;
        } catch (error) {
            console.error(`❌ Deezer search albums error for "${query}":`, error.message);
            return { data: [] };
        }
    }

    // Test connection to Deezer API
    static async testConnection() {
        try {
            console.log('🧪 Testing Deezer API connection...');

            const response = await axios.get(`${DEEZER_API_URL}/chart`, {
                params: { limit: 1 },
                timeout: 5000
            });

            if (response.status === 200) {
                console.log('✅ Deezer API connection successful');
                return true;
            } else {
                console.log('⚠️ Deezer API returned status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Deezer API connection failed:', error.message);
            return false;
        }
    }
}

module.exports = DeezerService;