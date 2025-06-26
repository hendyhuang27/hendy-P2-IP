// src/pages/Playlist/Playlist.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    fetchPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist
} from '../../store/slices/playlistSlice';
import { setCurrentTrack, setQueue, setIsPlaying } from '../../store/slices/musicSlice';
import '../../pages/Playlists/Playlists.css';

const Playlist = () => {
    const dispatch = useDispatch();
    const { playlists, loading, error } = useSelector(state => state.playlist);
    const { user } = useSelector(state => state.auth);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: ''
    });

    useEffect(() => {
        dispatch(fetchPlaylists());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Playlist name is required!'
            });
            return;
        }

        try {
            await dispatch(createPlaylist({
                name: formData.name.trim(),
                description: formData.description.trim(),
                image: formData.image.trim() || null
            })).unwrap();

            setShowCreateModal(false);
            setFormData({ name: '', description: '', image: '' });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Playlist created successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create playlist'
            });
        }
    };

    const handleEditPlaylist = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Playlist name is required!'
            });
            return;
        }

        try {
            await dispatch(updatePlaylist({
                id: selectedPlaylist.id,
                playlistData: {
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    image: formData.image.trim() || null
                }
            })).unwrap();

            setShowEditModal(false);
            setSelectedPlaylist(null);
            setFormData({ name: '', description: '', image: '' });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Playlist updated successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update playlist'
            });
        }
    };

    const handleDeletePlaylist = async (playlist) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete "${playlist.name}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deletePlaylist(playlist.id)).unwrap();

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Playlist has been deleted.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Failed to delete playlist'
                });
            }
        }
    };

    const handlePlayPlaylist = (playlist) => {
        if (playlist.tracks && playlist.tracks.length > 0) {
            dispatch(setCurrentTrack(playlist.tracks[0]));
            dispatch(setQueue(playlist.tracks));
            dispatch(setIsPlaying(true));
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Empty Playlist',
                text: 'This playlist is empty. Add some tracks first!'
            });
        }
    };

    const openCreateModal = () => {
        setFormData({ name: '', description: '', image: '' });
        setShowCreateModal(true);
    };

    const openEditModal = (playlist) => {
        setSelectedPlaylist(playlist);
        setFormData({
            name: playlist.name,
            description: playlist.description || '',
            image: playlist.image || ''
        });
        setShowEditModal(true);
    };

    const closeModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedPlaylist(null);
        setFormData({ name: '', description: '', image: '' });
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const getTotalDuration = (tracks) => {
        if (!tracks || tracks.length === 0) return 0;
        return tracks.reduce((total, track) => total + (track.duration || 0), 0);
    };

    if (loading) {
        return (
            <div className="playlist-page">
                <div className="container py-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading your playlists...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="playlist-page">
            <div className="container py-4">
                {/* Header */}
                <div className="playlist-header">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="page-title">
                                <i className="fas fa-list me-3"></i>
                                My Playlists
                            </h1>
                            <p className="page-subtitle">
                                Organize your favorite tracks into custom collections
                            </p>
                        </div>
                        <button
                            className="btn btn-primary btn-create"
                            onClick={openCreateModal}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Create Playlist
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger mb-4" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                {/* Playlists Grid */}
                {playlists.length > 0 ? (
                    <div className="playlists-grid">
                        <div className="row g-4">
                            {playlists.map((playlist) => (
                                <div key={playlist.id} className="col-lg-4 col-md-6">
                                    <div className="playlist-card">
                                        <div className="playlist-image">
                                            <img
                                                src={playlist.image || '/default-playlist.png'}
                                                alt={playlist.name}
                                                onError={(e) => {
                                                    e.target.src = `https://via.placeholder.com/300x300/667eea/ffffff?text=${encodeURIComponent(playlist.name.charAt(0).toUpperCase())}`;
                                                }}
                                            />
                                            <div className="playlist-overlay">
                                                <button
                                                    className="btn btn-play"
                                                    onClick={() => handlePlayPlaylist(playlist)}
                                                    title="Play playlist"
                                                >
                                                    <i className="fas fa-play"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="playlist-content">
                                            <div className="playlist-info">
                                                <h3 className="playlist-name">{playlist.name}</h3>
                                                <p className="playlist-description">
                                                    {playlist.description || 'No description'}
                                                </p>
                                                <div className="playlist-stats">
                                                    <span className="track-count">
                                                        <i className="fas fa-music me-1"></i>
                                                        {playlist.tracks?.length || 0} songs
                                                    </span>
                                                    {playlist.tracks && playlist.tracks.length > 0 && (
                                                        <span className="duration">
                                                            <i className="fas fa-clock me-1"></i>
                                                            {formatDuration(getTotalDuration(playlist.tracks))}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="playlist-actions">
                                                <Link
                                                    to={`/playlist/${playlist.id}`}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    <i className="fas fa-eye me-1"></i>
                                                    View
                                                </Link>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => openEditModal(playlist)}
                                                >
                                                    <i className="fas fa-edit me-1"></i>
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDeletePlaylist(playlist)}
                                                >
                                                    <i className="fas fa-trash me-1"></i>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-content">
                            <i className="fas fa-music empty-icon"></i>
                            <h3>No playlists yet</h3>
                            <p>Create your first playlist to organize your favorite music</p>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={openCreateModal}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Create Your First Playlist
                            </button>
                        </div>
                    </div>
                )}

                {/* Create Playlist Modal */}
                {showCreateModal && (
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fas fa-plus me-2"></i>
                                        Create New Playlist
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closeModals}
                                    ></button>
                                </div>
                                <form onSubmit={handleCreatePlaylist}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">
                                                Playlist Name *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter playlist name"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">
                                                Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="description"
                                                name="description"
                                                rows="3"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Describe your playlist (optional)"
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">
                                                Cover Image URL
                                            </label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                id="image"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/image.jpg (optional)"
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeModals}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-2"></i>
                                                    Create Playlist
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Playlist Modal */}
                {showEditModal && (
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fas fa-edit me-2"></i>
                                        Edit Playlist
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closeModals}
                                    ></button>
                                </div>
                                <form onSubmit={handleEditPlaylist}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="editName" className="form-label">
                                                Playlist Name *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="editName"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter playlist name"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editDescription" className="form-label">
                                                Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="editDescription"
                                                name="description"
                                                rows="3"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Describe your playlist (optional)"
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editImage" className="form-label">
                                                Cover Image URL
                                            </label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                id="editImage"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/image.jpg (optional)"
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeModals}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-2"></i>
                                                    Update Playlist
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Backdrop */}
                {(showCreateModal || showEditModal) && (
                    <div className="modal-backdrop fade show" onClick={closeModals}></div>
                )}
            </div>
        </div>
    );
};

export default Playlist;