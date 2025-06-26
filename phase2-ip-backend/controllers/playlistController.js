const { Playlist, User } = require('../models');

// Helper function to transform tracks to frontend format
const transformTrackForFrontend = (track) => ({
    id: track.id,
    title: track.title,
    artist: {
        name: track.artist || 'Unknown Artist'
    },
    album: {
        title: track.album || 'Unknown Album',
        cover_small: track.cover,
        cover_medium: track.cover
    },
    duration: track.duration || 0,
    preview: track.preview,
    deezer_id: track.id
});

// Helper function to transform playlist for frontend
const transformPlaylistForFrontend = (playlist) => ({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    isPublic: playlist.isPublic,
    createdAt: playlist.createdAt,
    updatedAt: playlist.updatedAt,
    tracks: (playlist.tracks || []).map(transformTrackForFrontend)
});

// Get all playlists for current user
const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        // Transform playlists for frontend
        const transformedPlaylists = playlists.map(transformPlaylistForFrontend);

        res.json({
            success: true, // ADD success field for frontend
            playlists: transformedPlaylists
        });
    } catch (error) {
        console.error('Get playlists error:', error);
        res.status(500).json({ message: 'Failed to get playlists' });
    }
};

// Get single playlist
const getPlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        const playlist = await Playlist.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const transformedPlaylist = transformPlaylistForFrontend(playlist);

        res.json({
            success: true,
            playlist: transformedPlaylist
        });
    } catch (error) {
        console.error('Get playlist error:', error);
        res.status(500).json({ message: 'Failed to get playlist' });
    }
};

// Create new playlist
const createPlaylist = async (req, res) => {
    try {
        const { name, description, isPublic = false } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Playlist name is required' });
        }

        const playlist = await Playlist.create({
            name,
            description,
            isPublic,
            userId: req.user.id,
            tracks: []
        });

        const transformedPlaylist = transformPlaylistForFrontend(playlist);

        res.status(201).json({
            success: true,
            message: 'Playlist created successfully',
            playlist: transformedPlaylist
        });
    } catch (error) {
        console.error('Create playlist error:', error);
        res.status(500).json({ message: 'Failed to create playlist' });
    }
};

// Update playlist
const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isPublic } = req.body;

        const playlist = await Playlist.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        await playlist.update({
            name: name || playlist.name,
            description: description !== undefined ? description : playlist.description,
            isPublic: isPublic !== undefined ? isPublic : playlist.isPublic
        });

        const transformedPlaylist = transformPlaylistForFrontend(playlist);

        res.json({
            success: true,
            message: 'Playlist updated successfully',
            playlist: transformedPlaylist
        });
    } catch (error) {
        console.error('Update playlist error:', error);
        res.status(500).json({ message: 'Failed to update playlist' });
    }
};

// Delete playlist
const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        const playlist = await Playlist.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        await playlist.destroy();

        res.json({
            success: true,
            message: 'Playlist deleted successfully'
        });
    } catch (error) {
        console.error('Delete playlist error:', error);
        res.status(500).json({ message: 'Failed to delete playlist' });
    }
};

// Add track to playlist
const addTrackToPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const trackData = req.body; // Frontend sends track data directly

        if (!trackData) {
            return res.status(400).json({ message: 'Track data is required' });
        }

        const playlist = await Playlist.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Check if track already exists in playlist
        const trackExists = playlist.tracks.find(track => track.id === trackData.id);
        if (trackExists) {
            return res.status(400).json({ message: 'Track already in playlist' });
        }

        // Add track to playlist (store the complete track data)
        const updatedTracks = [...playlist.tracks, trackData];
        await playlist.update({ tracks: updatedTracks });

        // Reload playlist to get updated data
        await playlist.reload();
        const transformedPlaylist = transformPlaylistForFrontend(playlist);

        res.json({
            success: true,
            message: 'Track added to playlist successfully',
            playlist: transformedPlaylist
        });
    } catch (error) {
        console.error('Add track to playlist error:', error);
        res.status(500).json({ message: 'Failed to add track to playlist' });
    }
};

// Remove track from playlist
const removeTrackFromPlaylist = async (req, res) => {
    try {
        const { id, trackId } = req.params;

        const playlist = await Playlist.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Remove track from playlist
        const updatedTracks = playlist.tracks.filter(track => track.id !== parseInt(trackId));
        await playlist.update({ tracks: updatedTracks });

        res.json({
            success: true,
            message: 'Track removed from playlist successfully'
        });
    } catch (error) {
        console.error('Remove track from playlist error:', error);
        res.status(500).json({ message: 'Failed to remove track from playlist' });
    }
};

module.exports = {
    getPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist
};