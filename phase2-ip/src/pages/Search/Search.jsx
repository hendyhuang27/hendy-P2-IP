// src/pages/Search/Search.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMusic, clearSearchResults } from '../../store/slices/musicSlice';
import { setCurrentTrack, setQueue, setIsPlaying } from '../../store/slices/musicSlice';
import musicService from '../../services/musicService'; // Direct import as fallback
import '../../pages/Search/Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [localResults, setLocalResults] = useState([]);
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const dispatch = useDispatch();

    // Try to get from Redux store
    const reduxState = useSelector(state => state.music || {});
    const {
        searchResults: reduxResults,
        searchLoading: reduxLoading,
        searchError: reduxError
    } = reduxState;

    // Use Redux data if available, otherwise use local state
    const searchResults = reduxResults || localResults;
    const loading = reduxLoading || localLoading;
    const error = reduxError || localError;

    useEffect(() => {
        return () => {
            if (dispatch && clearSearchResults) {
                dispatch(clearSearchResults());
            }
            // Clear local state too
            setLocalResults([]);
            setLocalError(null);
        };
    }, [dispatch]);

    // Direct API call as fallback
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

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        console.log('🔍 Starting search for:', query);

        // Clear previous results
        setLocalResults([]);
        setLocalError(null);

        // Try Redux first
        if (dispatch && searchMusic) {
            try {
                console.log('🔄 Using Redux search...');
                const result = await dispatch(searchMusic(query));

                if (searchMusic.fulfilled.match(result)) {
                    console.log('✅ Redux search successful');
                    // Redux will handle the state update
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
    };

    const handlePlayTrack = (track, index) => {
        console.log('🎵 Playing track:', track.title);

        // Try Redux actions if available
        if (dispatch && setCurrentTrack) {
            try {
                dispatch(setCurrentTrack(track));
                dispatch(setQueue(searchResults));
                dispatch(setIsPlaying(true));
            } catch (err) {
                console.error('❌ Redux play failed:', err);
                // Could add direct audio player here as fallback
                alert(`Playing: ${track.title} by ${track.artist?.name}`);
            }
        } else {
            // Fallback - just show alert
            alert(`Playing: ${track.title} by ${track.artist?.name}`);
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return '0:00';
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

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
                                Search millions of songs from around the world
                            </p>
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="search-form mb-5">
                            <div className="input-group search-input-group">
                                <input
                                    type="text"
                                    className="form-control search-input"
                                    placeholder="Search for songs, artists, or albums..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary search-btn"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        <i className="fas fa-search"></i>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Debug Info */}
                        <div className="mb-3">
                            <small className="text-muted">
                                Debug: Redux={reduxResults ? 'Available' : 'Not available'} |
                                Results={searchResults.length} |
                                Loading={loading ? 'Yes' : 'No'}
                            </small>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        )}

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="search-results">
                                <h3 className="mb-4">
                                    <i className="fas fa-music me-2"></i>
                                    Search Results ({searchResults.length})
                                </h3>

                                <div className="results-grid">
                                    {searchResults.map((track, index) => (
                                        <div key={track.id || index} className="track-card">
                                            <div className="track-image-container">
                                                <img
                                                    src={track.album?.cover_medium || track.album?.cover || 'https://via.placeholder.com/200x200?text=♪'}
                                                    alt={track.title}
                                                    className="track-image"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/200x200?text=♪';
                                                    }}
                                                />
                                                <div className="play-overlay">
                                                    <button
                                                        className="btn btn-primary play-button"
                                                        onClick={() => handlePlayTrack(track, index)}
                                                    >
                                                        <i className="fas fa-play"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="track-info">
                                                <h5 className="track-title">{track.title || 'Unknown Title'}</h5>
                                                <p className="track-artist">{track.artist?.name || 'Unknown Artist'}</p>
                                                <p className="track-album">{track.album?.title || 'Unknown Album'}</p>
                                                <div className="track-meta">
                                                    <span className="duration">
                                                        <i className="fas fa-clock me-1"></i>
                                                        {formatDuration(track.duration)}
                                                    </span>
                                                    {track.explicit_lyrics && (
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
                        {!loading && searchResults.length === 0 && query && (
                            <div className="no-results text-center py-5">
                                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                <h4>No results found</h4>
                                <p className="text-muted">
                                    Try searching with different keywords or check your spelling
                                </p>
                                <div className="mt-3">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => handleDirectSearch(query)}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-redo me-2"></i>
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Initial State */}
                        {!query && searchResults.length === 0 && (
                            <div className="search-suggestions text-center py-5">
                                <i className="fas fa-lightbulb fa-3x text-primary mb-3"></i>
                                <h4>Start your musical journey</h4>
                                <p className="text-muted mb-4">
                                    Search for your favorite songs, artists, or discover something new
                                </p>
                                <div className="suggestion-tags">
                                    {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical'].map(genre => (
                                        <button
                                            key={genre}
                                            className="btn btn-outline-primary btn-sm me-2 mb-2"
                                            onClick={() => {
                                                setQuery(genre);
                                                handleDirectSearch(genre);
                                            }}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;