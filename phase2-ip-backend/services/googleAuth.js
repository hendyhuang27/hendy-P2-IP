// services/googleAuth.js
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Note: using your existing user model path

// Initialize Google OAuth client
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

const googleAuth = {
    // Verify Google ID token
    verifyGoogleToken: async (idToken) => {
        try {
            console.log('🔍 Verifying Google token...');

            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            console.log('✅ Google token verified successfully');

            return {
                googleId: payload['sub'],
                email: payload['email'],
                name: payload['name'],
                avatar: payload['picture'],
                emailVerified: payload['email_verified']
            };
        } catch (error) {
            console.error('❌ Google token verification failed:', error.message);
            throw new Error('Invalid Google token');
        }
    },

    // Handle Google OAuth login/register
    handleGoogleAuth: async (idToken) => {
        try {
            console.log('🚀 Starting Google authentication process...');

            // Verify the Google token
            const googleUser = await googleAuth.verifyGoogleToken(idToken);
            console.log('👤 Google user data:', {
                email: googleUser.email,
                name: googleUser.name
            });

            // Check if user exists by email
            let user = await User.findOne({ email: googleUser.email });

            if (user) {
                console.log('👤 Existing user found, updating Google info...');

                // User exists - update their Google info
                user.provider = 'google';
                user.providerId = googleUser.googleId;
                user.googleId = googleUser.googleId;
                user.profilePicture = googleUser.avatar; // Using your existing field name
                user.emailVerified = googleUser.emailVerified;

                // Update last login if you have this method
                if (typeof user.updateLastLogin === 'function') {
                    await user.updateLastLogin();
                }
                await user.save();

                console.log('✅ Existing user updated successfully');
            } else {
                console.log('👤 New user, creating account...');

                // Create new user - adapt to your existing User model structure
                user = new User({
                    username: googleUser.email.split('@')[0], // Generate username from email
                    email: googleUser.email,
                    firstName: googleUser.name.split(' ')[0] || googleUser.name,
                    lastName: googleUser.name.split(' ').slice(1).join(' ') || '',
                    provider: 'google',
                    providerId: googleUser.googleId,
                    googleId: googleUser.googleId,
                    profilePicture: googleUser.avatar,
                    emailVerified: googleUser.emailVerified,
                    password: null, // No password for Google users
                });

                await user.save();

                // Update last login if you have this method
                if (typeof user.updateLastLogin === 'function') {
                    await user.updateLastLogin();
                }

                console.log('✅ New user created successfully');
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user._id,
                    id: user._id, // Include both for compatibility
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            console.log('🎟️ JWT token generated successfully');

            return {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePicture: user.profilePicture,
                    emailVerified: user.emailVerified,
                    provider: user.provider || 'google',
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                token
            };
        } catch (error) {
            console.error('❌ Google authentication error:', error);
            throw error;
        }
    }
};

module.exports = googleAuth;