// src/components/MusicPlayer/MusicPlayer.jsx
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
} from '../../store/slices/musicSlice';
import './MusicPlayer.css';

const MusicPlayer = () => {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying, volume, currentTime, duration, queue, currentIndex } = useSelector(state => state.music);
    const audioRef = useRef(null);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

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

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!currentTrack) {
        return null;
    }

    return (
        <div className="music-player">
            <audio
                ref={audioRef}
                src={currentTrack.preview}
                preload="metadata"
            />

            <div className="container-fluid">
                <div className="row align-items-center">
                    {/* Track Info */}
                    <div className="col-md-3">
                        <div className="track-info">
                            <img
                                src={currentTrack.album?.cover_small || '/default-album.png'}
                                alt={currentTrack.title}
                                className="track-image"
                            />
                            <div className="track-details">
                                <div className="track-title">{currentTrack.title}</div>
                                <div className="track-artist">{currentTrack.artist?.name}</div>
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
                                <span className="time-display">{formatTime(duration)}</span>
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
        </div>
    );
};

export default MusicPlayer;