// frontend/src/pages/Search/Search.jsx - ENHANCED WITH AI PLAYLIST GENERATOR
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMusic, clearSearchResults } from '../../store/slices/musicSlice';
import { setCurrentTrack, setQueue, setIsPlaying } from '../../store/slices/musicSlice';
import { fetchPlaylists, addTrackToPlaylist } from '../../store/slices/playlistSlice';
import musicService from '../../services/musicService';
import aiService from '../../services/aiService';
import AIPlaylistGenerator from '../../components/AIPlaylistGenarator/AIPlaylistGenerator'; // 🎵 NEW
import Swal from 'sweetalert2';
import '../../pages/Search/Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [localResults, setLocalResults] = useState([]);
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [showAddToPlaylist, setShowAddToPlaylist] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);

    // AI-specific state
    const [aiMode, setAiMode] = useState(false);
    const [aiResults, setAiResults] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState('');

    // 🎵 NEW: AI Playlist Generator state
    const [showPlaylistGenerator, setShowPlaylistGenerator] = useState(false);

    const dispatch = useDispatch();

    const reduxState = useSelector(state => state.music || {});
    const { playlists } = useSelector(state => state.playlist);
    const {
        searchResults: reduxResults,
        searchLoading: reduxLoading,
        searchError: reduxError
    } = reduxState;

    const searchResults = reduxResults || localResults;
    const loading = reduxLoading || localLoading;
    const error = reduxError || localError;

    useEffect(() => {
        dispatch(fetchPlaylists());

        return () => {
            if (dispatch && clearSearchResults) {
                dispatch(clearSearchResults());
            }
            setLocalResults([]);
            setLocalError(null);
            setAiResults([]);
        };
    }, [dispatch]);

    // AI Smart Search Function
    const handleAISearch = async (searchQuery) => {
        setAiLoading(true);
        setAiResults([]);
        setAiResponse('');

        try {
            console.log('🤖 Starting AI search for:', searchQuery);
            const response = await aiService.smartSearch(searchQuery);

            if (response.success && response.data) {
                setAiResults(response.data);
                setAiResponse(response.message || '');

                console.log('✅ AI search successful:', response.data.length, 'tracks found');
            } else {
                throw new Error(response.message || 'AI search failed');
            }

        } catch (err) {
            console.error('❌ AI search error:', err);
            setLocalError(`AI Search failed: ${err.response?.data?.message || err.message}`);

            // Fallback to regular search
            console.log('🔄 Falling back to regular search...');
            handleDirectSearch(searchQuery);
        }

        setAiLoading(false);
    };

    const handleDirectSearch = async (searchQuery) => {
        setLocalLoading(true);
        setLocalError(null);

        try {
            console.log('🔍 Direct search API call for:', searchQuery);
            const response = await musicService.searchMusic(searchQuery);
            console.log('✅ Direct search response:', response);

            if (response.data) {
                setLocalResults(response.data);
            } else {
                setLocalResults([]);
                setLocalError('No results found');
            }
        } catch (err) {
            console.error('❌ Direct search error:', err);
            setLocalError(`Search failed: ${err.message}`);
            setLocalResults([]);
        }

        setLocalLoading(false);
    };

    // Handle search with AI toggle
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        console.log('🔍 Starting search for:', query, 'AI Mode:', aiMode);

        // Clear previous results
        setLocalResults([]);
        setAiResults([]);
        setLocalError(null);
        setAiResponse('');

        if (aiMode) {
            // Use AI search
            await handleAISearch(query);
        } else {
            // Use regular search or Redux
            if (dispatch && searchMusic) {
                try {
                    console.log('🔄 Using Redux search...');
                    const result = await dispatch(searchMusic(query));

                    if (searchMusic.fulfilled.match(result)) {
                        console.log('✅ Redux search successful');
                    } else if (searchMusic.rejected.match(result)) {
                        console.log('❌ Redux search failed, trying direct API...');
                        handleDirectSearch(query);
                    }
                } catch (err) {
                    console.error('❌ Redux search failed:', err);
                    console.log('🔄 Falling back to direct API...');
                    handleDirectSearch(query);
                }
            } else {
                console.log('🔄 Redux not available, using direct API...');
                handleDirectSearch(query);
            }
        }
    };

    const handlePlayTrack = (track, index) => {
        console.log('🎵 Playing track:', track);

        if (dispatch && setCurrentTrack) {
            try {
                const currentResults = aiMode ? aiResults : searchResults;
                dispatch(setCurrentTrack(track));
                dispatch(setQueue(currentResults));
                dispatch(setIsPlaying(true));
            } catch (err) {
                console.error('❌ Redux play failed:', err);
                Swal.fire({
                    icon: 'info',
                    title: 'Playing',
                    text: `${track.title} by ${track.artist}`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Playing',
                text: `${track.title} by ${track.artist}`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const handleAddToPlaylist = (track) => {
        setSelectedTrack(track);
        setShowAddToPlaylist(true);
    };

    const addToSelectedPlaylist = async (playlistId) => {
        if (!selectedTrack) return;

        try {
            await dispatch(addTrackToPlaylist({
                playlistId,
                trackData: selectedTrack
            })).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Added!',
                text: `"${selectedTrack.title}" added to playlist`,
                timer: 2000,
                showConfirmButton: false
            });

            setShowAddToPlaylist(false);
            setSelectedTrack(null);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to add track to playlist'
            });
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return '0:00';
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getImageUrl = (track) => {
        if (track.image) return track.image;
        if (track.album?.cover_medium) return track.album.cover_medium;
        if (track.album?.cover_small) return track.album.cover_small;
        if (track.album?.cover) return track.album.cover;
        if (track.cover) return track.cover;

        return `https://via.placeholder.com/200x200/667eea/ffffff?text=${encodeURIComponent(track.title?.charAt(0) || '♪')}`;
    };

    // Get current results based on mode
    const currentResults = aiMode ? aiResults : searchResults;
    const currentLoading = aiMode ? aiLoading : loading;

    return (
        <div className="search-page">
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-8 mx-auto">
                        <div className="search-header text-center mb-5">
                            <h1 className="display-4 mb-3">
                                <i className="fas fa-search me-3"></i>
                                Discover Music
                            </h1>
                            <p className="lead text-muted">
                                Search millions of songs or let AI create the perfect playlist
                            </p>
                        </div>

                        {/* Mode Toggle - Enhanced with Playlist Generator */}
                        <div className="ai-toggle text-center mb-4">
                            <div className="btn-group" role="group">
                                <button
                                    type="button"
                                    className={`btn ${!aiMode ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setAiMode(false)}
                                >
                                    <i className="fas fa-search me-2"></i>
                                    Regular Search
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${aiMode ? 'btn-success' : 'btn-outline-success'}`}
                                    onClick={() => setAiMode(true)}
                                >
                                    <i className="fas fa-robot me-2"></i>
                                    AI Smart Search
                                </button>
                                {/* 🎵 NEW: Playlist Generator Button */}
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() => setShowPlaylistGenerator(true)}
                                >
                                    <i className="fas fa-magic me-2"></i>
                                    AI Playlist Generator
                                </button>
                            </div>

                            <div className="mt-2">
                                {aiMode ? (
                                    <small className="text-muted">
                                        🤖 Describe what you want to hear in natural language
                                    </small>
                                ) : (
                                    <small className="text-muted">
                                        🔍 Search for specific songs, artists, or albums
                                    </small>
                                )}
                            </div>
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="search-form mb-5">
                            <div className="input-group search-input-group">
                                <input
                                    type="text"
                                    className="form-control search-input"
                                    placeholder={
                                        aiMode
                                            ? "e.g., 'I need energetic music for working out' or 'Play something romantic'"
                                            : "Search for songs, artists, or albums..."
                                    }
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button
                                    className={`btn search-btn ${aiMode ? 'btn-success' : 'btn-primary'}`}
                                    type="submit"
                                    disabled={currentLoading}
                                >
                                    {currentLoading ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        <i className={`fas ${aiMode ? 'fa-robot' : 'fa-search'}`}></i>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* AI Response */}
                        {aiResponse && aiMode && (
                            <div className="alert alert-success d-flex align-items-center mb-4">
                                <i className="fas fa-robot me-3"></i>
                                <div>
                                    <strong>🤖 AI Assistant:</strong> {aiResponse}
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        )}

                        {/* Search Results */}
                        {currentResults.length > 0 && (
                            <div className="search-results">
                                <h3 className="mb-4">
                                    <i className={`fas ${aiMode ? 'fa-robot' : 'fa-music'} me-2`}></i>
                                    {aiMode ? 'AI Smart Results' : 'Search Results'} ({currentResults.length})
                                    {aiMode && (
                                        <span className="badge bg-success ms-2">
                                            <i className="fas fa-brain me-1"></i>
                                            AI Powered
                                        </span>
                                    )}
                                </h3>

                                <div className="results-grid">
                                    {currentResults.map((track, index) => (
                                        <div key={track.id || index} className="track-card">
                                            <div className="track-image-container">
                                                <img
                                                    src={getImageUrl(track)}
                                                    alt={track.title || 'Unknown Title'}
                                                    className="track-image"
                                                    onError={(e) => {
                                                        console.log('❌ Image failed, using fallback');
                                                        e.target.src = `https://via.placeholder.com/200x200/667eea/ffffff?text=${encodeURIComponent(track.title?.charAt(0) || '♪')}`;
                                                    }}
                                                />
                                                <div className="play-overlay">
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-primary play-button"
                                                            onClick={() => handlePlayTrack(track, index)}
                                                            title="Play"
                                                        >
                                                            <i className="fas fa-play"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => handleAddToPlaylist(track)}
                                                            title="Add to Playlist"
                                                            style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="track-info">
                                                <h5 className="track-title">
                                                    {track.title || track.name || 'Unknown Title'}
                                                </h5>
                                                <p className="track-artist">
                                                    {track.artist || track.artists || 'Unknown Artist'}
                                                </p>
                                                <p className="track-album">
                                                    {track.album || 'Unknown Album'}
                                                </p>
                                                <div className="track-meta">
                                                    <span className="duration">
                                                        <i className="fas fa-clock me-1"></i>
                                                        {formatDuration(track.duration)}
                                                    </span>
                                                    {track.explicit && (
                                                        <span className="explicit-badge">E</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {!currentLoading && currentResults.length === 0 && query && (
                            <div className="no-results text-center py-5">
                                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                <h4>No results found</h4>
                                <p className="text-muted">
                                    Try searching with different keywords or check your spelling
                                </p>
                                <div className="mt-3">
                                    <button
                                        className="btn btn-outline-primary me-2"
                                        onClick={() => {
                                            if (aiMode) {
                                                handleAISearch(query);
                                            } else {
                                                handleDirectSearch(query);
                                            }
                                        }}
                                        disabled={currentLoading}
                                    >
                                        <i className="fas fa-redo me-2"></i>
                                        Try Again
                                    </button>
                                    {!aiMode && (
                                        <button
                                            className="btn btn-outline-success me-2"
                                            onClick={() => {
                                                setAiMode(true);
                                                handleAISearch(query);
                                            }}
                                            disabled={currentLoading}
                                        >
                                            <i className="fas fa-robot me-2"></i>
                                            Try AI Search
                                        </button>
                                    )}
                                    {/* 🎵 NEW: Try Playlist Generator */}
                                    <button
                                        className="btn btn-outline-warning"
                                        onClick={() => setShowPlaylistGenerator(true)}
                                    >
                                        <i className="fas fa-magic me-2"></i>
                                        Try Playlist Generator
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Initial State with AI Examples */}
                        {!query && currentResults.length === 0 && (
                            <div className="search-suggestions text-center py-5">
                                <i className="fas fa-lightbulb fa-3x text-primary mb-3"></i>
                                <h4>Start your musical journey</h4>
                                <p className="text-muted mb-4">
                                    Search for your favorite songs, discover with AI, or generate complete playlists
                                </p>

                                {/* 🎵 NEW: Playlist Generator CTA */}
                                <div className="mb-4">
                                    <button
                                        className="btn btn-warning btn-lg"
                                        onClick={() => setShowPlaylistGenerator(true)}
                                    >
                                        <i className="fas fa-magic me-2"></i>
                                        Generate AI Playlist
                                    </button>
                                </div>

                                <div className="suggestion-tags mb-4">
                                    <h6>Regular Search:</h6>
                                    {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical'].map(genre => (
                                        <button
                                            key={genre}
                                            className="btn btn-outline-primary btn-sm me-2 mb-2"
                                            onClick={() => {
                                                setQuery(genre);
                                                setAiMode(false);
                                                handleDirectSearch(genre);
                                            }}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>

                                <div className="suggestion-tags">
                                    <h6>🤖 Try AI Search:</h6>
                                    {[
                                        'I need energetic music for working out',
                                        'Play something relaxing',
                                        'I want happy upbeat songs',
                                        'Find me some sad music'
                                    ].map(suggestion => (
                                        <button
                                            key={suggestion}
                                            className="btn btn-outline-success btn-sm me-2 mb-2"
                                            onClick={() => {
                                                setQuery(suggestion);
                                                setAiMode(true);
                                                handleAISearch(suggestion);
                                            }}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Playlist Modal */}
                        {showAddToPlaylist && (
                            <>
                                <div className="modal fade show d-block" tabIndex="-1">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">
                                                    <i className="fas fa-plus me-2"></i>
                                                    Add to Playlist
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    onClick={() => setShowAddToPlaylist(false)}
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                <p className="mb-3">
                                                    Add "<strong>{selectedTrack?.title}</strong>" by <strong>{selectedTrack?.artist}</strong> to:
                                                </p>

                                                {playlists.length > 0 ? (
                                                    <div className="list-group">
                                                        {playlists.map(playlist => (
                                                            <button
                                                                key={playlist.id}
                                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                                onClick={() => addToSelectedPlaylist(playlist.id)}
                                                            >
                                                                <div>
                                                                    <h6 className="mb-1">{playlist.name}</h6>
                                                                    <small className="text-muted">
                                                                        {playlist.tracks?.length || 0} songs
                                                                    </small>
                                                                </div>
                                                                <i className="fas fa-plus text-success"></i>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3">
                                                        <i className="fas fa-music fa-2x text-muted mb-2"></i>
                                                        <p className="text-muted">No playlists found. Create one first!</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-backdrop fade show" onClick={() => setShowAddToPlaylist(false)}></div>
                            </>
                        )}

                        {/* 🎵 NEW: AI Playlist Generator Modal */}
                        <AIPlaylistGenerator
                            isOpen={showPlaylistGenerator}
                            onClose={() => setShowPlaylistGenerator(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;