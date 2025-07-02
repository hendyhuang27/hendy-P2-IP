// src/components/MusicPlayer/MusicPlayer.jsx - COPY THIS ENTIRE FILE
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    nextTrack,
    previousTrack,
    togglePlay,
    resetPlayer,
} from '../../store/slices/musicSlice';
import './MusicPlayer.css';

const MusicPlayer = () => {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying, volume, currentTime, duration, queue, currentIndex } = useSelector(state => state.music);
    const audioRef = useRef(null);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false); // NEW: For minimizing player

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => dispatch(setCurrentTime(audio.currentTime));
        const updateDuration = () => dispatch(setDuration(audio.duration));
        const handleEnded = () => {
            if (currentIndex < queue.length - 1) {
                dispatch(nextTrack());
            } else {
                dispatch(setIsPlaying(false));
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [dispatch, currentIndex, queue.length]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(e => console.log('Play failed:', e));
        } else {
            audio.pause();
        }
    }, [isPlaying, currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
        }
    }, [volume]);

    const handlePlayPause = () => {
        dispatch(togglePlay());
    };

    const handlePrevious = () => {
        dispatch(previousTrack());
    };

    const handleNext = () => {
        dispatch(nextTrack());
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (audio) {
            const seekTime = (e.target.value / 100) * duration;
            audio.currentTime = seekTime;
            dispatch(setCurrentTime(seekTime));
        }
    };

    const handleVolumeChange = (e) => {
        dispatch(setVolume(e.target.value / 100));
    };

    // NEW: Close/Reset player
    const handleClosePlayer = () => {
        dispatch(resetPlayer());
        setIsMinimized(false);
    };

    // NEW: Minimize/Expand player
    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Better image handling for music player
    const getTrackImage = () => {
        if (!currentTrack) return '/default-album.png';

        // Try different image sources in order of preference
        if (currentTrack.image) return currentTrack.image;
        if (currentTrack.album?.cover_medium) return currentTrack.album.cover_medium;
        if (currentTrack.album?.cover_small) return currentTrack.album.cover_small;
        if (currentTrack.album?.cover) return currentTrack.album.cover;
        if (currentTrack.cover) return currentTrack.cover;

        // Fallback to placeholder with track initial
        return `https://via.placeholder.com/60x60/667eea/ffffff?text=${encodeURIComponent(currentTrack.title?.charAt(0) || '♪')}`;
    };

    const getArtistName = () => {
        if (!currentTrack) return 'Unknown Artist';
        return currentTrack.artist?.name || currentTrack.artist || currentTrack.artists || 'Unknown Artist';
    };

    const getTrackTitle = () => {
        if (!currentTrack) return 'No Track';
        return currentTrack.title || currentTrack.name || 'Unknown Title';
    };

    if (!currentTrack) {
        return null;
    }

    return (
        <div className={`music-player ${isMinimized ? 'minimized' : ''}`}>
            <audio
                ref={audioRef}
                src={currentTrack.preview}
                preload="metadata"
            />

            {/* NEW: Player Controls (Always visible) */}
            <div className="player-header">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center">
                            <img
                                src={getTrackImage()}
                                alt={getTrackTitle()}
                                className="track-image-mini me-2"
                                style={{ width: '40px', height: '40px', borderRadius: '4px' }}
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/40x40/667eea/ffffff?text=${encodeURIComponent(getTrackTitle().charAt(0) || '♪')}`;
                                }}
                            />
                            <div>
                                <div className="track-title-mini" style={{ fontSize: '14px', fontWeight: '600' }}>
                                    {getTrackTitle()}
                                </div>
                                <div className="track-artist-mini" style={{ fontSize: '12px', opacity: '0.8' }}>
                                    {getArtistName()}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <button
                                className="btn btn-link control-btn p-1"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                style={{ color: 'white', fontSize: '14px' }}
                            >
                                <i className="fas fa-step-backward"></i>
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={handlePlayPause}
                                style={{ width: '35px', height: '35px', borderRadius: '50%', fontSize: '12px' }}
                            >
                                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                            </button>

                            <button
                                className="btn btn-link control-btn p-1"
                                onClick={handleNext}
                                disabled={currentIndex === queue.length - 1}
                                style={{ color: 'white', fontSize: '14px' }}
                            >
                                <i className="fas fa-step-forward"></i>
                            </button>

                            <div className="d-flex align-items-center gap-2">
                                {/* NEW: Minimize Button */}
                                <button
                                    className="btn btn-link control-btn p-1"
                                    onClick={handleMinimize}
                                    title={isMinimized ? 'Expand Player' : 'Minimize Player'}
                                    style={{ color: 'white', fontSize: '14px' }}
                                >
                                    <i className={`fas ${isMinimized ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </button>

                                {/* NEW: Close Button */}
                                <button
                                    className="btn btn-link control-btn p-1"
                                    onClick={handleClosePlayer}
                                    title="Close Player"
                                    style={{ color: 'white', fontSize: '14px' }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar (Always visible) */}
                    <div className="progress-container-mini mb-2">
                        <input
                            type="range"
                            className="progress-slider w-100"
                            min="0"
                            max="100"
                            value={duration ? (currentTime / duration) * 100 : 0}
                            onChange={handleSeek}
                            style={{ height: '4px' }}
                        />
                        <div className="d-flex justify-content-between mt-1">
                            <span className="time-display" style={{ fontSize: '11px' }}>{formatTime(currentTime)}</span>
                            <span className="time-display" style={{ fontSize: '11px' }}>
                                {formatTime(duration)} <small>(preview)</small>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Player Content */}
            {!isMinimized && (
                <div className="container-fluid">
                    <div className="row align-items-center py-3">
                        {/* Track Info */}
                        <div className="col-md-3">
                            <div className="track-info">
                                <img
                                    src={getTrackImage()}
                                    alt={getTrackTitle()}
                                    className="track-image"
                                    onError={(e) => {
                                        console.log('❌ Music player image failed, using fallback');
                                        e.target.src = `https://via.placeholder.com/60x60/667eea/ffffff?text=${encodeURIComponent(getTrackTitle().charAt(0) || '♪')}`;
                                    }}
                                />
                                <div className="track-details">
                                    <div className="track-title">{getTrackTitle()}</div>
                                    <div className="track-artist">{getArtistName()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="col-md-6">
                            <div className="player-controls">
                                <div className="control-buttons">
                                    <button
                                        className="btn btn-link control-btn"
                                        onClick={handlePrevious}
                                        disabled={currentIndex === 0}
                                    >
                                        <i className="fas fa-step-backward"></i>
                                    </button>

                                    <button
                                        className="btn btn-primary play-btn"
                                        onClick={handlePlayPause}
                                    >
                                        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                                    </button>

                                    <button
                                        className="btn btn-link control-btn"
                                        onClick={handleNext}
                                        disabled={currentIndex === queue.length - 1}
                                    >
                                        <i className="fas fa-step-forward"></i>
                                    </button>
                                </div>

                                <div className="progress-container">
                                    <span className="time-display">{formatTime(currentTime)}</span>
                                    <input
                                        type="range"
                                        className="progress-slider"
                                        min="0"
                                        max="100"
                                        value={duration ? (currentTime / duration) * 100 : 0}
                                        onChange={handleSeek}
                                    />
                                    <span className="time-display">
                                        {formatTime(duration)}
                                        <small className="text-muted ms-1">(preview)</small>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Volume Control */}
                        <div className="col-md-3">
                            <div className="volume-control">
                                <button
                                    className="btn btn-link volume-btn"
                                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                                >
                                    <i className={`fas ${volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'}`}></i>
                                </button>

                                {showVolumeSlider && (
                                    <div className="volume-slider-container">
                                        <input
                                            type="range"
                                            className="volume-slider"
                                            min="0"
                                            max="100"
                                            value={volume * 100}
                                            onChange={handleVolumeChange}
                                        />
                                    </div>
                                )}

                                <div className="queue-info">
                                    {queue.length > 0 && (
                                        <span className="queue-count">{currentIndex + 1} / {queue.length}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .music-player.minimized {
                    height: auto;
                    padding: 0;
                }
                
                .player-header {
                    background: rgba(0, 0, 0, 0.1);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
};

export default MusicPlayer;