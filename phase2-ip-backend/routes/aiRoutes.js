// backend/routes/aiRoutes.js - FIXED WITH DEBUG
const express = require('express');
const router = express.Router();

console.log('🔧 Loading AI Routes...');

// Import AI controller with error handling
let aiController;
try {
    aiController = require('../controllers/aiController');
    console.log('✅ AI Controller imported successfully');
    console.log('📋 Available functions:', Object.keys(aiController));
} catch (error) {
    console.error('❌ Failed to import AI Controller:', error.message);
    process.exit(1);
}

// Import auth middleware
let auth;
try {
    auth = require('../middlewares/auth');
    console.log('✅ Auth middleware imported successfully');
} catch (error) {
    console.error('❌ Failed to import auth middleware:', error.message);
    process.exit(1);
}

// Extract functions with validation
const { smartSearch, testAI } = aiController;

if (typeof testAI !== 'function') {
    console.error('❌ testAI is not a function:', typeof testAI);
    process.exit(1);
}

if (typeof smartSearch !== 'function') {
    console.error('❌ smartSearch is not a function:', typeof smartSearch);
    process.exit(1);
}

console.log('✅ All handler functions validated');

// Set up routes
router.get('/test', testAI);
console.log('✅ Test route added');

router.post('/smart-search', auth, smartSearch);
console.log('✅ Smart search route added');

console.log('🎯 AI Routes setup complete');

module.exports = router;