// backend/controllers/aiController.js - ENHANCED WITH PLAYLIST GENERATION
const geminiService = require('../services/geminiService');
const axios = require('axios');

// 🎵 NEW: AI Playlist Generator
const generatePlaylist = async (req, res) => {
    try {
        const { query, trackCount = 15, saveName } = req.body;
        const userId = req.user.id;

        console.log('🎵 AI Playlist Generator request:', { query, trackCount, userId });

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Playlist description is required'
            });
        }

        // Step 1: Generate multiple search queries using AI
        console.log('🤖 Step 1: Generating search queries with AI...');
        let searchQueries;
        try {
            searchQueries = await geminiService.generatePlaylist(query, trackCount);
        } catch (geminiError) {
            console.log('⚠️ Gemini failed, using fallback queries');
            searchQueries = geminiService.playlistFallback(query, trackCount);
        }

        console.log('✅ Generated search queries:', searchQueries);

        // Step 2: Search for tracks using each query
        console.log('🔍 Step 2: Searching for tracks...');
        const allTracks = [];
        const searchPromises = searchQueries.map(async (searchQuery, index) => {
            try {
                console.log(`🔍 Searching ${index + 1}/${searchQueries.length}: "${searchQuery}"`);

                const tracks = await searchDeezer(searchQuery, 3); // Get 3 tracks per query

                if (tracks.length > 0) {
                    console.log(`✅ Found ${tracks.length} tracks for: "${searchQuery}"`);
                    return tracks;
                } else {
                    console.log(`⚠️ No results for: "${searchQuery}"`);
                    return [];
                }
            } catch (error) {
                console.log(`❌ Search failed for: "${searchQuery}"`, error.message);
                return [];
            }
        });

        // Execute all searches concurrently
        const searchResults = await Promise.allSettled(searchPromises);

        // Collect all tracks
        searchResults.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.length > 0) {
                allTracks.push(...result.value);
            }
        });

        console.log(`🎵 Total tracks found: ${allTracks.length}`);

        // Step 3: Remove duplicates and shuffle
        const uniqueTracks = removeDuplicateTracks(allTracks);
        const shuffledTracks = shuffleArray(uniqueTracks);
        const finalTracks = shuffledTracks.slice(0, trackCount);

        console.log(`🎵 Final playlist: ${finalTracks.length} unique tracks`);

        // Step 4: Generate playlist metadata (name and description)
        console.log('🎨 Step 4: Generating playlist metadata...');
        let playlistMetadata;
        try {
            playlistMetadata = await geminiService.generatePlaylistMetadata(query, finalTracks);
        } catch (error) {
            console.log('⚠️ Metadata generation failed, using fallback');
            playlistMetadata = geminiService.metadataFallback(query);
        }

        // Step 5: If user wants to save, create the playlist
        let savedPlaylist = null;
        if (saveName) {
            try {
                console.log('💾 Step 5: Saving playlist...');

                const { Playlist } = require('../models');

                savedPlaylist = await Playlist.create({
                    name: saveName,
                    description: playlistMetadata.description,
                    userId: userId,
                    tracks: finalTracks,
                    isPublic: false
                });

                console.log('✅ Playlist saved successfully:', savedPlaylist.id);
            } catch (saveError) {
                console.error('❌ Failed to save playlist:', saveError);
                // Don't fail the whole request if save fails
            }
        }

        // Response
        const result = {
            success: true,
            data: {
                tracks: finalTracks,
                metadata: playlistMetadata,
                savedPlaylist: savedPlaylist,
                stats: {
                    originalQuery: query,
                    requestedCount: trackCount,
                    foundCount: finalTracks.length,
                    searchQueries: searchQueries,
                    totalTracksFound: allTracks.length,
                    uniqueTracksFound: uniqueTracks.length
                }
            },
            message: `Generated ${finalTracks.length} tracks for your playlist: "${playlistMetadata.name}"`
        };

        return res.json(result);

    } catch (error) {
        console.error('❌ AI playlist generation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate playlist',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Enhanced smart search with better fallbacks (existing function)
const smartSearch = async (req, res) => {
    try {
        const { query } = req.body;

        console.log('🤖 AI Smart Search request:', query);

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Step 1: Convert with Gemini (with fallback)
        let aiSearchTerms;
        try {
            aiSearchTerms = await geminiService.generateMusicQuery(query);
            console.log('✅ AI generated search terms:', aiSearchTerms);
        } catch (geminiError) {
            console.log('⚠️ Gemini failed, using smart fallback');
            aiSearchTerms = geminiService.smartFallback(query);
        }

        // Step 2: Try multiple search variations if first one fails
        const searchVariations = [
            aiSearchTerms,
            aiSearchTerms.split(' ').slice(0, 2).join(' '), // First 2 words
            aiSearchTerms.split(' ')[0], // First word only
            'popular music' // Final fallback
        ];

        let finalTracks = [];
        let successfulSearch = '';

        for (const searchTerm of searchVariations) {
            console.log(`🔍 Trying search term: "${searchTerm}"`);

            try {
                const tracks = await searchDeezer(searchTerm);

                if (tracks.length > 0) {
                    finalTracks = tracks;
                    successfulSearch = searchTerm;
                    console.log(`✅ Found ${tracks.length} tracks with: "${searchTerm}"`);
                    break;
                } else {
                    console.log(`⚠️ No results for: "${searchTerm}"`);
                }
            } catch (searchError) {
                console.log(`❌ Search failed for: "${searchTerm}"`, searchError.message);
                continue;
            }
        }

        // If still no results, try some popular fallback searches
        if (finalTracks.length === 0) {
            console.log('🔄 Trying popular fallback searches...');
            const fallbackSearches = ['pop hits', 'top songs', 'music', 'songs'];

            for (const fallback of fallbackSearches) {
                try {
                    const tracks = await searchDeezer(fallback);
                    if (tracks.length > 0) {
                        finalTracks = tracks;
                        successfulSearch = fallback;
                        console.log(`✅ Fallback success with: "${fallback}"`);
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }
        }

        const result = {
            success: true,
            data: finalTracks,
            originalQuery: query,
            aiSearchTerms: aiSearchTerms,
            successfulSearch: successfulSearch,
            message: finalTracks.length > 0
                ? `AI found ${finalTracks.length} songs for "${query}"`
                : `No songs found for "${query}". Try different keywords.`,
            debug: {
                searchVariationsTried: searchVariations.length,
                finalSearchTerm: successfulSearch
            }
        };

        return res.json(result);

    } catch (error) {
        console.error('❌ AI smart search error:', error);
        return res.status(500).json({
            success: false,
            message: 'AI search failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Helper function to search Deezer (existing function)
async function searchDeezer(searchTerm, limit = 20) {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    if (!rapidApiKey) {
        throw new Error('RAPIDAPI_KEY not configured');
    }

    const options = {
        method: 'GET',
        url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
        params: {
            q: searchTerm,
            limit: limit
        },
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        },
        timeout: 15000
    };

    const response = await axios.request(options);

    // Handle response
    let tracks = [];
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
        tracks = response.data.data;
    }

    // Transform tracks
    return tracks.map((track, index) => ({
        id: track.id || `track_${Date.now()}_${index}`,
        title: track.title || track.title_short || 'Unknown Title',
        artist: track.artist?.name || track.artist || 'Unknown Artist',
        album: track.album?.title || track.album || 'Unknown Album',
        duration: track.duration || 0,
        preview: track.preview || null,
        image: track.album?.cover_xl ||
            track.album?.cover_big ||
            track.album?.cover_medium ||
            track.album?.cover_small ||
            track.album?.cover ||
            null,
        explicit: track.explicit_lyrics || false,
        rank: track.rank || null
    }));
}

// 🎵 NEW: Helper function to remove duplicate tracks
function removeDuplicateTracks(tracks) {
    const seen = new Set();
    return tracks.filter(track => {
        const key = `${track.title}-${track.artist}`.toLowerCase();
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// 🎵 NEW: Helper function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Enhanced test function (existing function)
const testAI = async (req, res) => {
    try {
        console.log('🧪 Testing AI system...');

        const tests = {
            rapidApiKey: !!process.env.RAPIDAPI_KEY,
            geminiApiKey: !!process.env.GEMINI_API_KEY,
            geminiConnection: false,
            deezerConnection: false
        };

        // Test Gemini
        try {
            await geminiService.testConnection();
            tests.geminiConnection = true;
        } catch (error) {
            console.log('❌ Gemini test failed:', error.message);
        }

        // Test Deezer
        try {
            const testTracks = await searchDeezer('test');
            tests.deezerConnection = testTracks.length >= 0;
        } catch (error) {
            console.log('❌ Deezer test failed:', error.message);
        }

        const workingCount = Object.values(tests).filter(Boolean).length;
        const totalTests = Object.keys(tests).length;

        return res.json({
            success: true,
            message: `AI System Status: ${workingCount}/${totalTests} components working`,
            tests,
            recommendations: {
                allWorking: workingCount === totalTests,
                canUseAI: tests.geminiConnection || tests.geminiApiKey,
                canSearchMusic: tests.deezerConnection && tests.rapidApiKey,
                canGeneratePlaylists: tests.geminiConnection && tests.deezerConnection && tests.rapidApiKey
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Test failed:', error);
        return res.status(500).json({
            success: false,
            message: 'System test failed',
            error: error.message
        });
    }
};

module.exports = {
    smartSearch,
    generatePlaylist, // 🎵 NEW: Export the new function
    testAI
};