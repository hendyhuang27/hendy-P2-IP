// src/pages/Dashboard/Dashboard.jsx - WORKING VERSION
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPlaylists } from '../../store/slices/playlistSlice';
import { setCurrentTrack, setQueue, setIsPlaying } from '../../store/slices/musicSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { playlists = [], loading = false } = useSelector(state => state.playlist || {});
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    useEffect(() => {
        try {
            dispatch(fetchPlaylists());
        } catch (error) {
            console.log('Error fetching playlists:', error);
        }
    }, [dispatch]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const playTrack = (track, playlistTracks = []) => {
        try {
            dispatch(setCurrentTrack(track));
            dispatch(setQueue(playlistTracks.length > 0 ? playlistTracks : [track]));
            dispatch(setIsPlaying(true));
        } catch (error) {
            console.log('Error playing track:', error);
        }
    };

    const playPlaylist = (playlist) => {
        if (playlist.tracks && playlist.tracks.length > 0) {
            playTrack(playlist.tracks[0], playlist.tracks);
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return '0:00';
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const showPlaylistModal = (playlist) => {
        setSelectedPlaylist(playlist);
    };

    const closeModal = () => {
        setSelectedPlaylist(null);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 0'
        }}>
            <div className="container">
                {/* Header */}
                <div className="text-center mb-5" style={{ color: 'white' }}>
                    <h1 className="display-4 mb-3">
                        {getGreeting()}, {user?.name || 'Music Lover'}!
                    </h1>
                    <p className="lead">Ready to discover your next favorite song?</p>
                </div>

                {/* Quick Actions */}
                <div className="row g-4 mb-5">
                    <div className="col-md-3 col-sm-6">
                        <Link to="/search" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: '15px',
                                padding: '2rem',
                                textAlign: 'center',
                                transition: 'transform 0.3s',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    color: 'white',
                                    fontSize: '1.5rem'
                                }}>
                                    <i className="fas fa-search"></i>
                                </div>
                                <h5 style={{ color: '#333', marginBottom: '0.5rem' }}>Search Music</h5>
                                <p style={{ color: '#666', margin: 0 }}>Discover millions of songs</p>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-3 col-sm-6">
                        <Link to="/playlists" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: '15px',
                                padding: '2rem',
                                textAlign: 'center',
                                transition: 'transform 0.3s',
                                cursor: 'pointer'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    color: 'white',
                                    fontSize: '1.5rem'
                                }}>
                                    <i className="fas fa-list"></i>
                                </div>
                                <h5 style={{ color: '#333', marginBottom: '0.5rem' }}>My Playlists</h5>
                                <p style={{ color: '#666', margin: 0 }}>Manage your collections</p>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-3 col-sm-6">
                        <div style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: '15px',
                            padding: '2rem',
                            textAlign: 'center',
                            cursor: 'pointer'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                color: 'white',
                                fontSize: '1.5rem'
                            }}>
                                <i className="fas fa-heart"></i>
                            </div>
                            <h5 style={{ color: '#333', marginBottom: '0.5rem' }}>Favorites</h5>
                            <p style={{ color: '#666', margin: 0 }}>Your liked songs</p>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: '15px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    color: 'white',
                                    fontSize: '1.5rem'
                                }}>
                                    <i className="fas fa-user"></i>
                                </div>
                                <h5 style={{ color: '#333', marginBottom: '0.5rem' }}>Profile</h5>
                                <p style={{ color: '#666', margin: 0 }}>Account settings</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Your Playlists */}
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 style={{ color: 'white', margin: 0 }}>
                            <i className="fas fa-music me-2"></i>
                            Your Playlists
                        </h3>
                        <Link to="/playlists" className="btn btn-outline-light">
                            View All <i className="fas fa-arrow-right ms-2"></i>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p style={{ color: 'white', marginTop: '1rem' }}>Loading playlists...</p>
                        </div>
                    ) : playlists.length > 0 ? (
                        <div className="row g-4">
                            {playlists.slice(0, 6).map((playlist) => (
                                <div key={playlist.id} className="col-lg-4 col-md-6">
                                    <div
                                        style={{
                                            background: 'rgba(255,255,255,0.95)',
                                            borderRadius: '15px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'transform 0.3s'
                                        }}
                                        onClick={() => showPlaylistModal(playlist)}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        {/* Playlist Image */}
                                        <div style={{
                                            height: '200px',
                                            background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '3rem',
                                            position: 'relative'
                                        }}>
                                            <i className="fas fa-music"></i>

                                            {/* Play Button Overlay */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'rgba(0,0,0,0.5)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0,
                                                transition: 'opacity 0.3s'
                                            }}
                                                className="hover-overlay"
                                                onMouseEnter={(e) => e.target.style.opacity = '1'}
                                                onMouseLeave={(e) => e.target.style.opacity = '0'}
                                            >
                                                <button
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        borderRadius: '50%',
                                                        background: '#1db954',
                                                        border: 'none',
                                                        color: 'white',
                                                        fontSize: '1.5rem',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        playPlaylist(playlist);
                                                    }}
                                                >
                                                    <i className="fas fa-play"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Playlist Info */}
                                        <div style={{ padding: '1.5rem' }}>
                                            <h5 style={{ color: '#333', marginBottom: '0.5rem' }}>
                                                {playlist.name}
                                            </h5>
                                            <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                {playlist.description || 'No description'}
                                            </p>
                                            <small style={{ color: '#999' }}>
                                                {playlist.tracks?.length || 0} songs
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5" style={{ color: 'white' }}>
                            <i className="fas fa-music fa-3x mb-3" style={{ opacity: 0.7 }}></i>
                            <h4>No playlists yet</h4>
                            <p className="mb-4">Create your first playlist to get started</p>
                            <Link to="/playlists" className="btn btn-light">
                                <i className="fas fa-plus me-2"></i>
                                Create Playlist
                            </Link>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="row g-4">
                    <div className="col-md-4">
                        <div style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: '15px',
                            padding: '2rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                color: 'white',
                                fontSize: '1.5rem'
                            }}>
                                <i className="fas fa-list"></i>
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#333' }}>
                                {playlists.length}
                            </h3>
                            <p style={{ margin: 0, color: '#666' }}>Playlists</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: '15px',
                            padding: '2rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                color: 'white',
                                fontSize: '1.5rem'
                            }}>
                                <i className="fas fa-music"></i>
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#333' }}>
                                {playlists.reduce((acc, p) => acc + (p.tracks?.length || 0), 0)}
                            </h3>
                            <p style={{ margin: 0, color: '#666' }}>Total Songs</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: '15px',
                            padding: '2rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                color: 'white',
                                fontSize: '1.5rem'
                            }}>
                                <i className="fas fa-clock"></i>
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#333' }}>
                                0
                            </h3>
                            <p style={{ margin: 0, color: '#666' }}>Hours Listened</p>
                        </div>
                    </div>
                </div>

                {/* Playlist Modal */}
                {selectedPlaylist && (
                    <>
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1050
                            }}
                            onClick={closeModal}
                        >
                            <div
                                style={{
                                    background: 'white',
                                    borderRadius: '15px',
                                    width: '90%',
                                    maxWidth: '600px',
                                    maxHeight: '80vh',
                                    overflow: 'hidden'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div style={{
                                    padding: '1.5rem 2rem',
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <h5 style={{ margin: 0, color: '#333' }}>
                                        <i className="fas fa-music me-2"></i>
                                        {selectedPlaylist.name}
                                    </h5>
                                    <button
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer',
                                            color: '#999'
                                        }}
                                        onClick={closeModal}
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div style={{ padding: '1.5rem 2rem', maxHeight: '400px', overflow: 'auto' }}>
                                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                                        {selectedPlaylist.description || 'No description'} • {selectedPlaylist.tracks?.length || 0} songs
                                    </p>

                                    {selectedPlaylist.tracks && selectedPlaylist.tracks.length > 0 ? (
                                        <div>
                                            {selectedPlaylist.tracks.map((track, index) => (
                                                <div
                                                    key={track.id || index}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        marginBottom: '0.5rem',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onClick={() => {
                                                        playTrack(track, selectedPlaylist.tracks);
                                                        closeModal();
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                >
                                                    <div style={{
                                                        width: '30px',
                                                        textAlign: 'center',
                                                        color: '#999',
                                                        marginRight: '1rem'
                                                    }}>
                                                        {index + 1}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                                            {track.title || 'Unknown Title'}
                                                        </div>
                                                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                                            {track.artist || 'Unknown Artist'} • {formatDuration(track.duration)}
                                                        </div>
                                                    </div>
                                                    <button
                                                        style={{
                                                            background: 'none',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '50%',
                                                            width: '32px',
                                                            height: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            color: '#667eea'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            playTrack(track, selectedPlaylist.tracks);
                                                            closeModal();
                                                        }}
                                                    >
                                                        <i className="fas fa-play" style={{ fontSize: '0.75rem' }}></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                                            <i className="fas fa-music" style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }}></i>
                                            <h5>No songs in this playlist</h5>
                                            <p style={{ color: '#666' }}>Add some songs to get started!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                {selectedPlaylist.tracks && selectedPlaylist.tracks.length > 0 && (
                                    <div style={{
                                        padding: '1rem 2rem',
                                        borderTop: '1px solid #eee',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <button
                                            style={{
                                                background: 'none',
                                                border: '1px solid #ddd',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                        <button
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                playPlaylist(selectedPlaylist);
                                                closeModal();
                                            }}
                                        >
                                            <i className="fas fa-play me-2"></i>
                                            Play All
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;