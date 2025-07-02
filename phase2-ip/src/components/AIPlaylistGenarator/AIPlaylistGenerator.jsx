// src/components/AIPlaylistGenerator/AIPlaylistGenerator.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import aiService from '../../services/aiService';
import { fetchPlaylists } from '../../store/slices/playlistSlice';
import { setCurrentTrack, setQueue, setIsPlaying } from '../../store/slices/musicSlice';
import Swal from 'sweetalert2';

const AIPlaylistGenerator = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [description, setDescription] = useState('');
    const [trackCount, setTrackCount] = useState(15);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPlaylist, setGeneratedPlaylist] = useState(null);
    const [playlistName, setPlaylistName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Example prompts for inspiration
    const examplePrompts = [
        "Create a high-energy workout playlist with rock and electronic music",
        "I need calming music for studying and concentration",
        "Make me a road trip playlist with classic rock and indie hits",
        "Generate a romantic dinner playlist with jazz and soul",
        "I want upbeat party music with hip hop and dance tracks",
        "Create a chill Sunday morning playlist with acoustic and folk",
        "Make a nostalgic 90s and 2000s hits playlist",
        "Generate background music for coding with ambient and lo-fi"
    ];

    const handleGenerate = async () => {
        if (!description.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Description Required',
                text: 'Please describe what kind of playlist you want!'
            });
            return;
        }

        setIsGenerating(true);
        setGeneratedPlaylist(null);

        try {
            console.log('🎵 Generating AI playlist...');

            const response = await aiService.generatePlaylistPreview(description, trackCount);

            if (response.success && response.data) {
                setGeneratedPlaylist(response.data);
                setPlaylistName(response.data.metadata?.name || 'AI Generated Playlist');

                Swal.fire({
                    icon: 'success',
                    title: 'Playlist Generated! 🎵',
                    text: `Created ${response.data.tracks.length} tracks for you!`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                throw new Error(response.message || 'Failed to generate playlist');
            }

        } catch (error) {
            console.error('❌ Playlist generation failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Generation Failed',
                text: error.response?.data?.message || error.message || 'Failed to generate playlist'
            });
        }

        setIsGenerating(false);
    };

    const handleSavePlaylist = async () => {
        if (!generatedPlaylist || !playlistName.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Name Required',
                text: 'Please enter a name for your playlist!'
            });
            return;
        }

        setIsSaving(true);

        try {
            console.log('💾 Saving AI generated playlist...');

            const response = await aiService.generateAndSavePlaylist(
                description,
                playlistName.trim(),
                trackCount
            );

            if (response.success && response.data.savedPlaylist) {
                // Refresh playlists in Redux store
                dispatch(fetchPlaylists());

                Swal.fire({
                    icon: 'success',
                    title: 'Playlist Saved! 🎉',
                    text: `"${playlistName}" has been added to your library!`,
                    timer: 3000,
                    showConfirmButton: false
                });

                // Close the modal after successful save
                setTimeout(() => {
                    onClose();
                    resetForm();
                }, 2000);

            } else {
                throw new Error('Failed to save playlist');
            }

        } catch (error) {
            console.error('❌ Save playlist failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: error.response?.data?.message || error.message || 'Failed to save playlist'
            });
        }

        setIsSaving(false);
    };

    const handlePlayTrack = (track, index) => {
        if (generatedPlaylist?.tracks) {
            dispatch(setCurrentTrack(track));
            dispatch(setQueue(generatedPlaylist.tracks));
            dispatch(setIsPlaying(true));
        }
    };

    const handlePlayAllTracks = () => {
        if (generatedPlaylist?.tracks && generatedPlaylist.tracks.length > 0) {
            dispatch(setCurrentTrack(generatedPlaylist.tracks[0]));
            dispatch(setQueue(generatedPlaylist.tracks));
            dispatch(setIsPlaying(true));
        }
    };

    const resetForm = () => {
        setDescription('');
        setTrackCount(15);
        setGeneratedPlaylist(null);
        setPlaylistName('');
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const formatDuration = (duration) => {
        if (!duration) return '0:00';
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getTrackImage = (track) => {
        return track.image ||
            track.album?.cover_medium ||
            track.cover ||
            `https://via.placeholder.com/60x60/667eea/ffffff?text=${encodeURIComponent(track.title?.charAt(0) || '♪')}`;
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={handleClose}
                style={{ zIndex: 1050 }}
            ></div>

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                style={{ zIndex: 1055 }}
            >
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content" style={{ height: '90vh' }}>

                        {/* Header */}
                        <div className="modal-header" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white'
                        }}>
                            <h5 className="modal-title">
                                <i className="fas fa-robot me-2"></i>
                                AI Playlist Generator
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={handleClose}
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body p-4" style={{ overflow: 'auto' }}>

                            {/* Generator Form */}
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h6 className="card-title">
                                                <i className="fas fa-magic me-2"></i>
                                                Describe Your Perfect Playlist
                                            </h6>

                                            <div className="mb-3">
                                                <label className="form-label">What kind of music do you want?</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="4"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="e.g., 'Create a high-energy workout playlist' or 'I need relaxing music for studying'"
                                                    style={{ resize: 'vertical' }}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Number of tracks: <strong>{trackCount}</strong>
                                                </label>
                                                <input
                                                    type="range"
                                                    className="form-range"
                                                    min="5"
                                                    max="25"
                                                    step="5"
                                                    value={trackCount}
                                                    onChange={(e) => setTrackCount(parseInt(e.target.value))}
                                                />
                                                <div className="d-flex justify-content-between text-muted small">
                                                    <span>5</span>
                                                    <span>15</span>
                                                    <span>25</span>
                                                </div>
                                            </div>

                                            <button
                                                className="btn btn-primary btn-lg w-100 mb-3"
                                                onClick={handleGenerate}
                                                disabled={isGenerating || !description.trim()}
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Generating Playlist...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-robot me-2"></i>
                                                        Generate Playlist
                                                    </>
                                                )}
                                            </button>

                                            {/* Example Prompts */}
                                            <div>
                                                <h6 className="text-muted mb-2">
                                                    <i className="fas fa-lightbulb me-1"></i>
                                                    Need inspiration? Try these:
                                                </h6>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {examplePrompts.slice(0, 4).map((prompt, index) => (
                                                        <button
                                                            key={index}
                                                            className="btn btn-outline-secondary btn-sm"
                                                            onClick={() => setDescription(prompt)}
                                                            style={{ fontSize: '0.75rem' }}
                                                        >
                                                            {prompt.substring(0, 30)}...
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Generated Playlist Display */}
                                <div className="col-md-6">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            {!generatedPlaylist ? (
                                                <div className="text-center text-muted py-5">
                                                    <i className="fas fa-music fa-3x mb-3" style={{ opacity: 0.3 }}></i>
                                                    <h6>Your AI-generated playlist will appear here</h6>
                                                    <p className="small">Describe what you want and click "Generate Playlist"</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    {/* Playlist Header */}
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h6 className="mb-1">
                                                                <i className="fas fa-list me-2"></i>
                                                                {generatedPlaylist.metadata?.name || 'AI Generated Playlist'}
                                                            </h6>
                                                            <p className="text-muted small mb-2">
                                                                {generatedPlaylist.metadata?.description}
                                                            </p>
                                                            <small className="text-muted">
                                                                {generatedPlaylist.tracks.length} tracks •
                                                                {Math.ceil(generatedPlaylist.tracks.reduce((sum, track) => sum + (track.duration || 180), 0) / 60)} min
                                                            </small>
                                                        </div>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={handlePlayAllTracks}
                                                            title="Play all tracks"
                                                        >
                                                            <i className="fas fa-play"></i>
                                                        </button>
                                                    </div>

                                                    {/* Save Form */}
                                                    <div className="mb-3 p-3 bg-light rounded">
                                                        <div className="row g-2">
                                                            <div className="col">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Enter playlist name"
                                                                    value={playlistName}
                                                                    onChange={(e) => setPlaylistName(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-auto">
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={handleSavePlaylist}
                                                                    disabled={isSaving || !playlistName.trim()}
                                                                >
                                                                    {isSaving ? (
                                                                        <span className="spinner-border spinner-border-sm"></span>
                                                                    ) : (
                                                                        <>
                                                                            <i className="fas fa-save me-1"></i>
                                                                            Save
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Track List */}
                                                    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                                                        {generatedPlaylist.tracks.map((track, index) => (
                                                            <div
                                                                key={track.id || index}
                                                                className="d-flex align-items-center p-2 rounded mb-1 hover-bg-light"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handlePlayTrack(track, index)}
                                                            >
                                                                <img
                                                                    src={getTrackImage(track)}
                                                                    alt={track.title}
                                                                    className="rounded me-3"
                                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                    onError={(e) => {
                                                                        e.target.src = `https://via.placeholder.com/40x40/667eea/ffffff?text=${encodeURIComponent(track.title?.charAt(0) || '♪')}`;
                                                                    }}
                                                                />
                                                                <div className="flex-grow-1 min-w-0">
                                                                    <div className="fw-medium text-truncate" style={{ fontSize: '0.9rem' }}>
                                                                        {track.title}
                                                                    </div>
                                                                    <div className="text-muted text-truncate" style={{ fontSize: '0.8rem' }}>
                                                                        {track.artist}
                                                                    </div>
                                                                </div>
                                                                <div className="text-muted small me-2">
                                                                    {formatDuration(track.duration)}
                                                                </div>
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePlayTrack(track, index);
                                                                    }}
                                                                >
                                                                    <i className="fas fa-play" style={{ fontSize: '0.7rem' }}></i>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer bg-light">
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <small className="text-muted">
                                    <i className="fas fa-info-circle me-1"></i>
                                    AI-powered by Gemini • Music from Deezer
                                </small>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary me-2"
                                        onClick={handleClose}
                                    >
                                        Close
                                    </button>
                                    {generatedPlaylist && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleSavePlaylist}
                                            disabled={isSaving || !playlistName.trim()}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-2"></i>
                                                    Save to Library
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-bg-light:hover {
                    background-color: #f8f9fa !important;
                }
                
                .modal-dialog-scrollable .modal-body {
                    overflow-y: auto;
                }
                
                .form-range::-webkit-slider-thumb {
                    background: #667eea;
                }
                
                .form-range::-moz-range-thumb {
                    background: #667eea;
                    border: none;
                }
            `}</style>
        </>
    );
};

export default AIPlaylistGenerator;