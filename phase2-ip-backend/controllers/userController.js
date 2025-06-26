const { User, Playlist } = require('../models');

// Get User Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Playlist,
                    attributes: ['id', 'name', 'description', 'isPublic', 'createdAt']
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User Profile
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, username } = req.body;
        const userId = req.user.id;

        // Check if username is taken (if provided and different from current)
        if (username && username !== req.user.username) {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Username already taken'
                });
            }
        }

        // Update user
        await User.update(
            { firstName, lastName, username },
            { where: { id: userId } }
        );

        // Get updated user
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Please provide current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters long'
            });
        }

        // Get user with password
        const user = await User.findByPk(userId);

        // Check current password
        const isMatch = await user.checkPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        await User.update(
            { password: newPassword },
            { where: { id: userId } }
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword
};