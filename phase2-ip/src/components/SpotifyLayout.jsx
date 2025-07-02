// src/components/SpotifyLayout.jsx - CREATE THIS NEW FILE
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

const SpotifyLayout = () => {
    // State management
    const [currentView, setCurrentView] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [queue, setQueue] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [showAddToPlaylist, setShowAddToPlaylist] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const audioRef = useRef(null);
    const { user } = useSelector(state => state.auth);

    // Sample music data with 50+ artists
    const sampleTracks = [
        // Top Current Hits
        { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: 200, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=BL", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 2, title: "Shape of You", artist: "Ed Sheeran", album: "÷ (Divide)", duration: 233, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=SY", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
        { id: 3, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: 203, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=LV", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },
        { id: 4, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: 174, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=WS", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },
        { id: 5, title: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", duration: 178, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=G4U", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" },

        // Bruno Mars Hits
        { id: 6, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", album: "Uptown Special", duration: 270, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=UF", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 7, title: "24K Magic", artist: "Bruno Mars", album: "24K Magic", duration: 226, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=24K", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
        { id: 8, title: "Count on Me", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", duration: 195, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=COM", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },
        { id: 9, title: "Just the Way You Are", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", duration: 220, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=JTWY", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },

        // Maroon 5 Hits
        { id: 10, title: "Sugar", artist: "Maroon 5", album: "V", duration: 235, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=SG", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" },
        { id: 11, title: "Payphone", artist: "Maroon 5 ft. Wiz Khalifa", album: "Overexposed", duration: 231, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=PP", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 12, title: "Animals", artist: "Maroon 5", album: "V", duration: 231, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=AN", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
        { id: 13, title: "Cold", artist: "Maroon 5 ft. Future", album: "Red Pill Blues", duration: 218, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=CD", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },

        // Taylor Swift Hits
        { id: 14, title: "Anti-Hero", artist: "Taylor Swift", album: "Midnights", duration: 200, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=AH", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },
        { id: 15, title: "Shake It Off", artist: "Taylor Swift", album: "1989", duration: 219, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=SIO", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" },
        { id: 16, title: "Love Story", artist: "Taylor Swift", album: "Fearless", duration: 235, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=LS", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 17, title: "Bad Blood", artist: "Taylor Swift ft. Kendrick Lamar", album: "1989", duration: 211, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=BB", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },

        // More popular artists (adding 35+ more songs)
        { id: 18, title: "Thank U, Next", artist: "Ariana Grande", album: "Thank U, Next", duration: 207, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=TUN", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },
        { id: 19, title: "7 rings", artist: "Ariana Grande", album: "Thank U, Next", duration: 178, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=7R", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },
        { id: 20, title: "Sorry", artist: "Justin Bieber", album: "Purpose", duration: 200, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=SR", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" },
        { id: 21, title: "Love Yourself", artist: "Justin Bieber", album: "Purpose", duration: 233, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=LY", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 22, title: "God's Plan", artist: "Drake", album: "Scorpion", duration: 198, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=GP", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
        { id: 23, title: "Hotline Bling", artist: "Drake", album: "Views", duration: 267, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=HB", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },
        { id: 24, title: "Bad Guy", artist: "Billie Eilish", album: "When We All Fall Asleep", duration: 194, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=BG", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },
        { id: 25, title: "Lovely", artist: "Billie Eilish & Khalid", album: "13 Reasons Why", duration: 200, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=LV", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" },
        { id: 26, title: "Circles", artist: "Post Malone", album: "Hollywood's Bleeding", duration: 215, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=CR", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 27, title: "Sunflower", artist: "Post Malone & Swae Lee", album: "Spider-Verse Soundtrack", duration: 158, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=SF", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
        { id: 28, title: "Someone Like You", artist: "Adele", album: "21", duration: 285, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=SLY", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },
        { id: 29, title: "Hello", artist: "Adele", album: "25", duration: 295, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=HL", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },
        { id: 30, title: "Rolling in the Deep", artist: "Adele", album: "21", duration: 228, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=RITD", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" },

        // Continue with more top artists...
        { id: 31, title: "Señorita", artist: "Shawn Mendes & Camila Cabello", album: "Shawn Mendes", duration: 191, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=SN", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 32, title: "Perfect", artist: "Ed Sheeran", album: "÷ (Divide)", duration: 263, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=PF", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
        { id: 33, title: "Roar", artist: "Katy Perry", album: "Prism", duration: 223, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=RR", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },
        { id: 34, title: "Havana", artist: "Camila Cabello ft. Young Thug", album: "Camila", duration: 217, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=HV", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },
        { id: 35, title: "Old Town Road", artist: "Lil Nas X ft. Billy Ray Cyrus", album: "7", duration: 157, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=OTR", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" },
        { id: 36, title: "Believer", artist: "Imagine Dragons", album: "Evolve", duration: 204, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=BL", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 37, title: "Thunder", artist: "Imagine Dragons", album: "Evolve", duration: 187, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=TH", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
        { id: 38, title: "High Hopes", artist: "Panic! At The Disco", album: "Pray for the Wicked", duration: 191, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=HH", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },
        { id: 39, title: "Can't Feel My Face", artist: "The Weeknd", album: "Beauty Behind the Madness", duration: 213, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=CFMF", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },
        { id: 40, title: "All of Me", artist: "John Legend", album: "Love in the Future", duration: 269, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=AOM", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" },

        // Adding more to reach 50+ tracks
        { id: 41, title: "Stay With Me", artist: "Sam Smith", album: "In the Lonely Hour", duration: 232, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=SWM", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 42, title: "Thinking Out Loud", artist: "Ed Sheeran", album: "x", duration: 281, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=TOL", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
        { id: 43, title: "Happy", artist: "Pharrell Williams", album: "Girl", duration: 232, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=HP", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },
        { id: 44, title: "Counting Stars", artist: "OneRepublic", album: "Native", duration: 257, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=CS", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },
        { id: 45, title: "Radioactive", artist: "Imagine Dragons", album: "Night Visions", duration: 186, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=RA", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" },
        { id: 46, title: "Demons", artist: "Imagine Dragons", album: "Night Visions", duration: 175, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=DM", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" },
        { id: 47, title: "Memories", artist: "Maroon 5", album: "Jordi", duration: 189, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=MM", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
        { id: 48, title: "What Makes You Beautiful", artist: "One Direction", album: "Up All Night", duration: 198, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=WMYB", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" },
        { id: 49, title: "Story of My Life", artist: "One Direction", album: "Midnight Memories", duration: 245, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=SOML", preview: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3" },
        { id: 50, title: "Best Day Of My Life", artist: "American Authors", album: "Oh, What a Life", duration: 193, image: "https://via.placeholder.com/300x300/1db954/ffffff?text=BDOML", preview: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg" }
    ];

    // Initialize playlists
    useEffect(() => {
        setPlaylists([
            { id: 1, name: 'Liked Songs', description: 'Your favorite tracks', tracks: [], cover: null },
            { id: 2, name: 'Recently Played', description: 'Your recent listens', tracks: sampleTracks.slice(0, 5), cover: null },
            { id: 3, name: 'Discover Weekly', description: 'Your weekly mix', tracks: sampleTracks.slice(10, 20), cover: null }
        ]);
    }, []);

    // Search function
    const searchMusic = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const results = sampleTracks.filter(track =>
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.artist.toLowerCase().includes(query.toLowerCase()) ||
            track.album.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(results);
        setIsLoading(false);
    };

    // Music player functions
    const playTrack = (track, trackList = null) => {
        setCurrentTrack(track);
        setIsPlaying(true);

        if (trackList) {
            setQueue(trackList);
            const index = trackList.findIndex(t => t.id === track.id);
            setCurrentTrackIndex(index !== -1 ? index : 0);
        } else {
            setQueue([track]);
            setCurrentTrackIndex(0);
        }
    };

    const togglePlayPause = () => {
        if (!currentTrack) return;

        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        if (queue.length === 0) return;
        const nextIndex = (currentTrackIndex + 1) % queue.length;
        setCurrentTrackIndex(nextIndex);
        setCurrentTrack(queue[nextIndex]);
    };

    const prevTrack = () => {
        if (queue.length === 0) return;
        const prevIndex = currentTrackIndex === 0 ? queue.length - 1 : currentTrackIndex - 1;
        setCurrentTrackIndex(prevIndex);
        setCurrentTrack(queue[prevIndex]);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (e) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Playlist functions
    const createPlaylist = () => {
        if (!newPlaylistName.trim()) return;

        const newPlaylist = {
            id: playlists.length + 1,
            name: newPlaylistName.trim(),
            description: `Created by ${user?.name || 'you'}`,
            tracks: [],
            cover: null
        };

        setPlaylists([...playlists, newPlaylist]);
        setNewPlaylistName('');
        setShowCreatePlaylist(false);
    };

    const addToPlaylist = (playlistId) => {
        if (!selectedTrack) return;

        setPlaylists(prev => prev.map(playlist => {
            if (playlist.id === playlistId) {
                const trackExists = playlist.tracks.find(t => t.id === selectedTrack.id);
                if (!trackExists) {
                    return {
                        ...playlist,
                        tracks: [...playlist.tracks, selectedTrack]
                    };
                }
            }
            return playlist;
        }));

        setShowAddToPlaylist(null);
        setSelectedTrack(null);
    };

    // Auto-play when track changes
    useEffect(() => {
        if (currentTrack && audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log('Auto-play failed:', e));
            }
        }
    }, [currentTrack]);

    // Audio event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleTimeUpdate);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleTimeUpdate);
        };
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div style={{
            backgroundColor: '#121212',
            color: '#ffffff',
            minHeight: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Audio Element */}
            {currentTrack && (
                <audio
                    ref={audioRef}
                    src={currentTrack.preview}
                    volume={volume}
                />
            )}

            <div style={{ display: 'flex', height: '100vh' }}>
                {/* Sidebar */}
                <div style={{
                    width: '240px',
                    backgroundColor: '#000000',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #282828'
                }}>
                    {/* Logo */}
                    <div style={{
                        marginBottom: '32px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#1db954',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        🎵 Hendy Music
                    </div>

                    {/* Main Navigation */}
                    <div style={{ marginBottom: '32px' }}>
                        {[
                            { id: 'home', icon: '🏠', label: 'Home' },
                            { id: 'search', icon: '🔍', label: 'Search' },
                            { id: 'library', icon: '📚', label: 'Your Library' }
                        ].map(item => (
                            <div
                                key={item.id}
                                onClick={() => setCurrentView(item.id)}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    backgroundColor: currentView === item.id ? '#1a1a1a' : 'transparent',
                                    color: currentView === item.id ? '#1db954' : '#b3b3b3',
                                    marginBottom: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentView !== item.id) {
                                        e.currentTarget.style.backgroundColor = '#1a1a1a';
                                        e.currentTarget.style.color = '#ffffff';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentView !== item.id) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#b3b3b3';
                                    }
                                }}
                            >
                                <span>{item.icon}</span>
                                <span style={{ fontWeight: '500' }}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Playlists Section */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <span style={{ color: '#b3b3b3', fontSize: '14px', fontWeight: 'bold' }}>PLAYLISTS</span>
                            <button
                                onClick={() => setShowCreatePlaylist(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#b3b3b3',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#1a1a1a';
                                    e.target.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#b3b3b3';
                                }}
                            >
                                +
                            </button>
                        </div>

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {playlists.map(playlist => (
                                <div
                                    key={playlist.id}
                                    style={{
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        marginBottom: '4px',
                                        color: '#b3b3b3',
                                        fontSize: '14px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#1a1a1a';
                                        e.currentTarget.style.color = '#ffffff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#b3b3b3';
                                    }}
                                    onClick={() => {
                                        setCurrentView('playlist');
                                    }}
                                >
                                    {playlist.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#121212'
                }}>
                    {/* Top Bar */}
                    <div style={{
                        height: '64px',
                        padding: '0 32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#121212',
                        borderBottom: '1px solid #282828'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                color: '#b3b3b3',
                                cursor: 'pointer',
                                fontSize: '18px',
                                padding: '8px',
                                borderRadius: '50%'
                            }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#1a1a1a';
                                    e.target.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#b3b3b3';
                                }}>
                                ←
                            </button>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                color: '#b3b3b3',
                                cursor: 'pointer',
                                fontSize: '18px',
                                padding: '8px',
                                borderRadius: '50%'
                            }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#1a1a1a';
                                    e.target.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#b3b3b3';
                                }}>
                                →
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
                                Welcome, {user?.name || 'Hendy'}!
                            </span>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#1db954',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#000000',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}>
                                {(user?.name || 'Hendy').charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div style={{
                        flex: 1,
                        padding: '32px',
                        overflowY: 'auto',
                        paddingBottom: currentTrack ? '120px' : '32px'
                    }}>
                        {/* Home View */}
                        {currentView === 'home' && (
                            <div>
                                <h1 style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    marginBottom: '32px',
                                    background: 'linear-gradient(90deg, #ffffff, #b3b3b3)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    {getGreeting()}
                                </h1>

                                {/* Quick Actions */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '16px',
                                    marginBottom: '48px'
                                }}>
                                    {playlists.slice(0, 3).map((playlist, index) => (
                                        <div
                                            key={playlist.id}
                                            onClick={() => {
                                                if (playlist.tracks.length > 0) {
                                                    playTrack(playlist.tracks[0], playlist.tracks);
                                                }
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: '#282828',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                height: '80px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#3e3e3e';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#282828';
                                            }}
                                        >
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                backgroundColor: '#1db954',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px',
                                                flexShrink: 0
                                            }}>
                                                {index === 0 ? '💚' : index === 1 ? '🕐' : '🎯'}
                                            </div>
                                            <div style={{ padding: '16px', flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontWeight: 'bold',
                                                    marginBottom: '4px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {playlist.name}
                                                </div>
                                                <div style={{
                                                    color: '#b3b3b3',
                                                    fontSize: '14px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {playlist.tracks.length} songs
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Featured Music */}
                                <h2 style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    marginBottom: '24px',
                                    color: '#ffffff'
                                }}>
                                    Featured Today
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                    gap: '24px'
                                }}>
                                    {sampleTracks.slice(0, 8).map(track => (
                                        <div
                                            key={track.id}
                                            style={{
                                                backgroundColor: '#181818',
                                                borderRadius: '8px',
                                                padding: '16px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                position: 'relative'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#282828';
                                                const playBtn = e.currentTarget.querySelector('.play-button');
                                                if (playBtn) playBtn.style.opacity = '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#181818';
                                                const playBtn = e.currentTarget.querySelector('.play-button');
                                                if (playBtn) playBtn.style.opacity = '0';
                                            }}
                                        >
                                            <div style={{ position: 'relative', marginBottom: '16px' }}>
                                                <img
                                                    src={track.image}
                                                    alt={track.title}
                                                    style={{
                                                        width: '100%',
                                                        aspectRatio: '1',
                                                        borderRadius: '4px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <button
                                                    className="play-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        playTrack(track, sampleTracks);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '8px',
                                                        right: '8px',
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#1db954',
                                                        border: 'none',
                                                        color: '#000000',
                                                        fontSize: '16px',
                                                        cursor: 'pointer',
                                                        opacity: '0',
                                                        transition: 'opacity 0.2s, transform 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 8px 8px rgba(0,0,0,0.3)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    ▶
                                                </button>
                                            </div>
                                            <h3 style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                marginBottom: '8px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: '#ffffff'
                                            }}>
                                                {track.title}
                                            </h3>
                                            <p style={{
                                                color: '#b3b3b3',
                                                fontSize: '14px',
                                                margin: 0,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {track.artist}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search View */}
                        {currentView === 'search' && (
                            <div>
                                <h1 style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    marginBottom: '32px',
                                    color: '#ffffff'
                                }}>
                                    Search
                                </h1>

                                {/* Search Bar */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={{
                                        position: 'relative',
                                        maxWidth: '400px'
                                    }}>
                                        <input
                                            type="text"
                                            placeholder="What do you want to listen to?"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    searchMusic(searchQuery);
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '12px 48px 12px 16px',
                                                borderRadius: '24px',
                                                border: 'none',
                                                backgroundColor: '#242424',
                                                color: '#ffffff',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                        />
                                        <button
                                            onClick={() => searchMusic(searchQuery)}
                                            disabled={isLoading}
                                            style={{
                                                position: 'absolute',
                                                right: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: '#b3b3b3',
                                                cursor: 'pointer',
                                                fontSize: '16px'
                                            }}
                                        >
                                            {isLoading ? '⏳' : '🔍'}
                                        </button>
                                    </div>
                                </div>

                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div>
                                        <h2 style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            marginBottom: '24px',
                                            color: '#ffffff'
                                        }}>
                                            Search Results ({searchResults.length})
                                        </h2>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                            gap: '24px'
                                        }}>
                                            {searchResults.map(track => (
                                                <div
                                                    key={track.id}
                                                    style={{
                                                        backgroundColor: '#181818',
                                                        borderRadius: '8px',
                                                        padding: '16px',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s',
                                                        position: 'relative'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#282828';
                                                        const playBtn = e.currentTarget.querySelector('.play-button');
                                                        if (playBtn) playBtn.style.opacity = '1';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#181818';
                                                        const playBtn = e.currentTarget.querySelector('.play-button');
                                                        if (playBtn) playBtn.style.opacity = '0';
                                                    }}
                                                >
                                                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                                                        <img
                                                            src={track.image}
                                                            alt={track.title}
                                                            style={{
                                                                width: '100%',
                                                                aspectRatio: '1',
                                                                borderRadius: '4px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        <button
                                                            className="play-button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                playTrack(track, searchResults);
                                                            }}
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: '8px',
                                                                right: '8px',
                                                                width: '48px',
                                                                height: '48px',
                                                                borderRadius: '50%',
                                                                backgroundColor: '#1db954',
                                                                border: 'none',
                                                                color: '#000000',
                                                                fontSize: '16px',
                                                                cursor: 'pointer',
                                                                opacity: '0',
                                                                transition: 'opacity 0.2s',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            ▶
                                                        </button>
                                                    </div>
                                                    <h3 style={{
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        marginBottom: '8px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        color: '#ffffff'
                                                    }}>
                                                        {track.title}
                                                    </h3>
                                                    <p style={{
                                                        color: '#b3b3b3',
                                                        fontSize: '14px',
                                                        margin: 0,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {track.artist}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Browse Categories when no search */}
                                {searchResults.length === 0 && !isLoading && (
                                    <div>
                                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#ffffff' }}>
                                            Browse all
                                        </h2>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                            gap: '24px'
                                        }}>
                                            {[
                                                { name: 'Pop', color: '#1db954', emoji: '🎤' },
                                                { name: 'Hip Hop', color: '#e13300', emoji: '🎤' },
                                                { name: 'Rock', color: '#8400e7', emoji: '🎸' },
                                                { name: 'Electronic', color: '#00d4aa', emoji: '🎛️' }
                                            ].map((category, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        setSearchQuery(category.name);
                                                        searchMusic(category.name);
                                                    }}
                                                    style={{
                                                        backgroundColor: category.color,
                                                        borderRadius: '8px',
                                                        padding: '20px',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s',
                                                        position: 'relative',
                                                        height: '120px',
                                                        overflow: 'hidden'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <h3 style={{
                                                        fontSize: '24px',
                                                        fontWeight: 'bold',
                                                        margin: 0,
                                                        color: '#ffffff'
                                                    }}>
                                                        {category.name}
                                                    </h3>
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '-10px',
                                                        right: '-10px',
                                                        fontSize: '60px',
                                                        opacity: '0.8',
                                                        transform: 'rotate(25deg)'
                                                    }}>
                                                        {category.emoji}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Library View */}
                        {currentView === 'library' && (
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '32px'
                                }}>
                                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff' }}>
                                        Your Library
                                    </h1>
                                    <button
                                        onClick={() => setShowCreatePlaylist(true)}
                                        style={{
                                            backgroundColor: '#1db954',
                                            color: '#000000',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '8px 16px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Create Playlist
                                    </button>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                    gap: '24px'
                                }}>
                                    {playlists.map(playlist => (
                                        <div
                                            key={playlist.id}
                                            style={{
                                                backgroundColor: '#181818',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#282828';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#181818';
                                            }}
                                            onClick={() => {
                                                if (playlist.tracks.length > 0) {
                                                    playTrack(playlist.tracks[0], playlist.tracks);
                                                }
                                            }}
                                        >
                                            <div style={{
                                                width: '60px',
                                                height: '60px',
                                                backgroundColor: '#535353',
                                                borderRadius: '4px',
                                                marginBottom: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px'
                                            }}>
                                                📁
                                            </div>
                                            <h3 style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                marginBottom: '8px',
                                                color: '#ffffff'
                                            }}>
                                                {playlist.name}
                                            </h3>
                                            <p style={{
                                                color: '#b3b3b3',
                                                fontSize: '14px',
                                                marginBottom: '8px'
                                            }}>
                                                {playlist.description}
                                            </p>
                                            <p style={{
                                                color: '#b3b3b3',
                                                fontSize: '12px',
                                                margin: 0
                                            }}>
                                                {playlist.tracks.length} songs
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Player */}
            {currentTrack && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '90px',
                    backgroundColor: '#181818',
                    borderTop: '1px solid #282828',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    gap: '16px',
                    zIndex: 100
                }}>
                    {/* Track Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '180px' }}>
                        <img
                            src={currentTrack.image}
                            alt={currentTrack.title}
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '4px',
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                marginBottom: '4px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: '#ffffff'
                            }}>
                                {currentTrack.title}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#b3b3b3',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {currentTrack.artist}
                            </div>
                        </div>
                    </div>

                    {/* Player Controls */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={prevTrack}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#b3b3b3',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#b3b3b3';
                                }}
                            >
                                ⏮
                            </button>
                            <button
                                onClick={togglePlayPause}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ffffff',
                                    border: 'none',
                                    color: '#000000',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            <button
                                onClick={nextTrack}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#b3b3b3',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#b3b3b3';
                                }}
                            >
                                ⏭
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '500px' }}>
                            <span style={{ fontSize: '11px', color: '#b3b3b3', minWidth: '40px' }}>
                                {formatTime(currentTime)}
                            </span>
                            <div
                                onClick={handleSeek}
                                style={{
                                    flex: 1,
                                    height: '4px',
                                    backgroundColor: '#535353',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <div style={{
                                    height: '100%',
                                    backgroundColor: '#1db954',
                                    borderRadius: '2px',
                                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                                    transition: 'width 0.1s'
                                }} />
                            </div>
                            <span style={{ fontSize: '11px', color: '#b3b3b3', minWidth: '40px' }}>
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Volume Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                        <span style={{ fontSize: '16px', color: '#b3b3b3' }}>🔊</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => {
                                setVolume(parseFloat(e.target.value));
                                if (audioRef.current) {
                                    audioRef.current.volume = parseFloat(e.target.value);
                                }
                            }}
                            style={{
                                width: '80px',
                                height: '4px',
                                backgroundColor: '#535353',
                                outline: 'none',
                                borderRadius: '2px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Create Playlist Modal */}
            {showCreatePlaylist && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#282828',
                        borderRadius: '8px',
                        padding: '32px',
                        width: '400px',
                        maxWidth: '90vw'
                    }}>
                        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
                            Create playlist
                        </h2>
                        <input
                            type="text"
                            placeholder="Playlist name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: '#3e3e3e',
                                color: '#ffffff',
                                fontSize: '16px',
                                marginBottom: '24px',
                                outline: 'none'
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    createPlaylist();
                                }
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowCreatePlaylist(false);
                                    setNewPlaylistName('');
                                }}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '20px',
                                    border: '1px solid #535353',
                                    backgroundColor: 'transparent',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createPlaylist}
                                disabled={!newPlaylistName.trim()}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    backgroundColor: newPlaylistName.trim() ? '#1db954' : '#535353',
                                    color: newPlaylistName.trim() ? '#000000' : '#ffffff',
                                    cursor: newPlaylistName.trim() ? 'pointer' : 'not-allowed',
                                    fontWeight: 'bold'
                                }}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpotifyLayout;