const { Playlist } = require('../models');
const DeezerService = require('../services/deezerService');

// Fallback data in case Deezer API fails
const fallbackTracks = [
    {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        duration: 233,
        preview: "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
        cover: "https://api.deezer.com/album/14808606/image",
        artistId: 12345,
        albumId: 67890
    },
    {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: 200,
        preview: "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
        cover: "https://api.deezer.com/album/14808606/image",
        artistId: 12346,
        albumId: 67891
    },
    {
        id: 3,
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        album: "Fine Line",
        duration: 174,
        preview: "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
        cover: "https://api.deezer.com/album/14808606/image",
        artistId: 12347,
        albumId: 67892
    },
    {
        id: 4,
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: 203,
        preview: "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
        cover: "https://api.deezer.com/album/14808606/image",
        artistId: 12348,
        albumId: 67893
    },
    {
        id: 5,
        title: "Good 4 U",
        artist: "Olivia Rodrigo",
        album: "SOUR",
        duration: 178,
        preview: "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
        cover: "https://api.deezer.com/album/14808606/image",
        artistId: 12349,
        albumId: 67894
    }
];

const seedPlaylists = async (users) => {
    try {
        console.log('Seeding playlists with music data...');

        const existingPlaylists = await Playlist.findAll();
        if (existingPlaylists.length > 0) {
            console.log('Playlists already exist, skipping playlist seeding');
            return existingPlaylists;
        }

        let popularTracks = [];
        let searchEminem = [];
        let searchColdplay = [];
        let searchTaylorSwift = [];

        try {
            console.log('Fetching data from Deezer API...');

            // Try to fetch data from Deezer API
            const [chartData, eminemData, coldplayData, taylorData] = await Promise.allSettled([
                DeezerService.getChart(20),
                DeezerService.searchTracks('eminem', 10),
                DeezerService.searchTracks('coldplay', 10),
                DeezerService.searchTracks('taylor swift', 10)
            ]);

            // Process results with fallbacks
            if (chartData.status === 'fulfilled' && chartData.value?.data) {
                popularTracks = chartData.value;
                console.log('✅ Chart data fetched successfully');
            } else {
                console.log('⚠️ Chart data failed, using fallback');
                popularTracks = { data: fallbackTracks };
            }

            if (eminemData.status === 'fulfilled' && eminemData.value?.data) {
                searchEminem = eminemData.value;
                console.log('✅ Eminem data fetched successfully');
            } else {
                console.log('⚠️ Eminem data failed, using fallback');
                searchEminem = { data: fallbackTracks.slice(0, 3) };
            }

            if (coldplayData.status === 'fulfilled' && coldplayData.value?.data) {
                searchColdplay = coldplayData.value;
                console.log('✅ Coldplay data fetched successfully');
            } else {
                console.log('⚠️ Coldplay data failed, using fallback');
                searchColdplay = { data: fallbackTracks.slice(1, 4) };
            }

            if (taylorData.status === 'fulfilled' && taylorData.value?.data) {
                searchTaylorSwift = taylorData.value;
                console.log('✅ Taylor Swift data fetched successfully');
            } else {
                console.log('⚠️ Taylor Swift data failed, using fallback');
                searchTaylorSwift = { data: fallbackTracks.slice(2, 5) };
            }

        } catch (apiError) {
            console.log('⚠️ Deezer API completely failed, using all fallback data');
            console.log('API Error:', apiError.message);

            // Use fallback data for everything
            popularTracks = { data: fallbackTracks };
            searchEminem = { data: fallbackTracks.slice(0, 3) };
            searchColdplay = { data: fallbackTracks.slice(1, 4) };
            searchTaylorSwift = { data: fallbackTracks.slice(2, 5) };
        }

        // Helper function to safely process tracks
        const processTrack = (track) => ({
            id: track.id || Math.floor(Math.random() * 1000000),
            title: track.title || 'Unknown Title',
            artist: track.artist?.name || track.artist || 'Unknown Artist',
            album: track.album?.title || track.album || 'Unknown Album',
            duration: track.duration || 180,
            preview: track.preview || 'https://cdns-preview-d.dzcdn.net/stream/preview.mp3',
            cover: track.album?.cover_medium || track.cover || 'https://api.deezer.com/album/14808606/image',
            artistId: track.artist?.id || track.artistId || Math.floor(Math.random() * 10000),
            albumId: track.album?.id || track.albumId || Math.floor(Math.random() * 10000)
        });

        const playlistsData = [
            {
                name: 'Top Hits 2024',
                description: 'The most popular songs right now',
                userId: users[0].id,
                tracks: (popularTracks.data || []).slice(0, 10).map(processTrack),
                isPublic: true
            },
            {
                name: 'Eminem Classics',
                description: 'Best tracks from the rap god',
                userId: users[1].id,
                tracks: (searchEminem.data || []).slice(0, 8).map(processTrack),
                isPublic: true
            },
            {
                name: 'Coldplay Vibes',
                description: 'Chill with Coldplay',
                userId: users[2].id,
                tracks: (searchColdplay.data || []).slice(0, 6).map(processTrack),
                isPublic: false
            },
            {
                name: 'Taylor Swift Hits',
                description: 'Swiftie favorites',
                userId: users[3].id,
                tracks: (searchTaylorSwift.data || []).slice(0, 7).map(processTrack),
                isPublic: true
            },
            {
                name: 'My Favorites',
                description: 'Personal collection',
                userId: users[0].id,
                tracks: (popularTracks.data || []).slice(10, 15).map(processTrack),
                isPublic: false
            }
        ];

        const playlists = await Playlist.bulkCreate(playlistsData);
        console.log(`✅ Created ${playlists.length} sample playlists with music data`);

        // Log playlist details
        playlists.forEach((playlist, index) => {
            console.log(`   ${index + 1}. ${playlist.name} (${playlist.tracks.length} tracks)`);
        });

        return playlists;
    } catch (error) {
        console.error('Error seeding playlists:', error);
        throw error;
    }
};

module.exports = { seedPlaylists };