// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const { Op } = require('sequelize');

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            provider: user.provider || 'local'
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// Helper function to remove password from user object
const sanitizeUser = (user) => {
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;
    return userResponse;
};

// Register Controller
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            provider: 'local'
        });

        // Generate token
        const token = generateToken(user);

        // Return response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: sanitizeUser(user)
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user);

        // Return response
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: sanitizeUser(user)
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Google Login Controller
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        console.log('🔍 Google Login - Received token:', token ? 'Token received' : 'No token');

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Google token is required'
            });
        }

        // Verify the Google token
        console.log('🔍 Verifying token with Google...');
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log('✅ Google verification successful for:', payload.email);

        const {
            sub: googleId,
            email,
            name,
            given_name: firstName,
            family_name: lastName,
            picture: profilePicture,
            email_verified: emailVerified
        } = payload;

        // Check if user exists
        let user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { googleId: googleId }
                ]
            }
        });

        if (user) {
            console.log('✅ Existing user found, updating Google info...');
            // Update existing user with Google info
            await user.update({
                googleId: googleId,
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                profilePicture: profilePicture || user.profilePicture,
                emailVerified: emailVerified || user.emailVerified,
                provider: 'google'
            });
        } else {
            console.log('✅ Creating new Google user...');
            // Create new user
            user = await User.create({
                username: name || email.split('@')[0],
                email: email,
                googleId: googleId,
                firstName: firstName,
                lastName: lastName,
                profilePicture: profilePicture,
                emailVerified: emailVerified,
                provider: 'google',
                password: null // Google users don't need password
            });
        }

        // Generate JWT token
        const jwtToken = generateToken(user);

        console.log('✅ Google authentication successful for user:', user.id);

        res.status(200).json({
            success: true,
            message: 'Google authentication successful',
            token: jwtToken,
            user: sanitizeUser(user)
        });

    } catch (error) {
        console.error('❌ Google auth error:', error);

        if (error.message.includes('Token used too early')) {
            return res.status(400).json({
                success: false,
                message: 'Google token not yet valid'
            });
        }

        if (error.message.includes('Wrong number of segments')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Google token format'
            });
        }

        if (error.message.includes('Invalid token signature')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Google token signature'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Authentication error'
        });
    }
};

// Get Current User Controller
const getMe = async (req, res) => {
    try {
        // The user is already attached to req by the auth middleware
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: sanitizeUser(user)
        });

    } catch (error) {
        console.error('❌ Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user information',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    register,
    login,
    googleLogin,
    getMe
};