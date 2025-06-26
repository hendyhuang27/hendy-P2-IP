// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPlaylists } from '../../store/slices/playlistSlice';
import { setCurrentTrack, setQueue, setIsPlaying } from '../../store/slices/musicSlice';
import '../../pages/Dashboard/Dashboard.css';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { playlists, loading } = useSelector(state => state.playlist);

    useEffect(() => {
        dispatch(fetchPlaylists());
    }, [dispatch]);

    const handlePlayPlaylist = (playlist) => {
        if (playlist.tracks && playlist.tracks.length > 0) {
            dispatch(setCurrentTrack(playlist.tracks[0]));
            dispatch(setQueue(playlist.tracks));
            dispatch(setIsPlaying(true));
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const recentPlaylists = playlists.slice(0, 6);

    return (
        <div className="dashboard-page">
            <div className="container py-4">
                {/* Welcome Section */}
                <div className="welcome-section mb-5">
                    <h1 className="display-4 mb-2">
                        {getGreeting()}, {user?.name || 'Music Lover'}!
                    </h1>
                    <p className="lead text-muted">
                        Ready to discover your next favorite song?
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions mb-5">
                    <div className="row g-4">
                        <div className="col-md-3 col-sm-6">
                            <Link to="/search" className="action-card">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="action-icon mb-3">
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <h5 className="card-title">Search Music</h5>
                                        <p className="card-text text-muted">
                                            Discover millions of songs
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <Link to="/playlists" className="action-card">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="action-icon mb-3">
                                            <i className="fas fa-list"></i>
                                        </div>
                                        <h5 className="card-title">My Playlists</h5>
                                        <p className="card-text text-muted">
                                            Manage your collections
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="action-card">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="action-icon mb-3">
                                            <i className="fas fa-heart"></i>
                                        </div>
                                        <h5 className="card-title">Favorites</h5>
                                        <p className="card-text text-muted">
                                            Your liked songs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <Link to="/profile" className="action-card">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <div className="action-icon mb-3">
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <h5 className="card-title">Profile</h5>
                                        <p className="card-text text-muted">
                                            Account settings
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Playlists */}
                <div className="recent-playlists">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3>
                            <i className="fas fa-music me-2"></i>
                            Your Playlists
                        </h3>
                        <Link to="/playlists" className="btn btn-outline-primary">
                            View All <i className="fas fa-arrow-right ms-2"></i>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : recentPlaylists.length > 0 ? (
                        <div className="row g-4">
                            {recentPlaylists.map((playlist) => (
                                <div key={playlist.id} className="col-lg-4 col-md-6">
                                    <div className="playlist-card">
                                        <div className="playlist-image">
                                            <img
                                                src={playlist.image || '/default-playlist.png'}
                                                alt={playlist.name}
                                                className="card-img-top"
                                                onError={(e) => {
                                                    e.target.src = `https://via.placeholder.com/300x300/667eea/ffffff?text=${encodeURIComponent(playlist.name.charAt(0).toUpperCase())}`;
                                                }}
                                            />
                                            <div className="playlist-overlay">
                                                <button
                                                    className="btn btn-primary play-btn"
                                                    onClick={() => handlePlayPlaylist(playlist)}
                                                >
                                                    <i className="fas fa-play"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{playlist.name}</h5>
                                            <p className="card-text text-muted">
                                                {playlist.description || 'No description'}
                                            </p>
                                            <small className="text-muted">
                                                {playlist.tracks?.length || 0} songs
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state text-center py-5">
                            <i className="fas fa-music fa-3x text-muted mb-3"></i>
                            <h4>No playlists yet</h4>
                            <p className="text-muted mb-4">
                                Create your first playlist to get started
                            </p>
                            <Link to="/playlists" className="btn btn-primary">
                                <i className="fas fa-plus me-2"></i>
                                Create Playlist
                            </Link>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="stats-section mt-5">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-list"></i>
                                </div>
                                <div className="stat-info">
                                    <h3>{playlists.length}</h3>
                                    <p>Playlists</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-music"></i>
                                </div>
                                <div className="stat-info">
                                    <h3>{playlists.reduce((acc, p) => acc + (p.tracks?.length || 0), 0)}</h3>
                                    <p>Total Songs</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stat-info">
                                    <h3>0</h3>
                                    <p>Hours Listened</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;