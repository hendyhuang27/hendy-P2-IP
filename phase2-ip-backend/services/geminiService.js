// backend/services/geminiService.js - ENHANCED WITH PLAYLIST GENERATION
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY not found in environment variables');
            return;
        }

        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('✅ Gemini AI service initialized with gemini-1.5-flash');
    }

    // 🎵 NEW: Generate AI Playlist with multiple search queries
    async generatePlaylist(userRequest, trackCount = 15) {
        try {
            console.log('🤖 Gemini generating playlist for:', userRequest);

            const prompt = `You are a music expert AI that creates playlists. Based on the user's request, generate ${trackCount} diverse search queries that will find great songs for their playlist.

User request: "${userRequest}"

Rules:
1. Generate exactly ${trackCount} different search queries
2. Each query should be 2-4 words maximum
3. Focus on genres, moods, artists, or specific songs that match the request
4. Make queries diverse but cohesive to the theme
5. Use terms that work well with music APIs like Deezer/Spotify
6. Remove conversational words
7. Return ONLY the search queries, one per line
8. No numbers, bullets, or extra text

Examples:
User request: "Create a workout playlist"
Response:
energetic workout
pump up songs
high energy rock
cardio music
gym motivation
upbeat electronic
fitness beats
power metal
dance workout
running music
motivational hip hop
intense training
exercise motivation
adrenaline rush
athletic performance

User request: "${userRequest}"
Response:`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const searchQueries = response.text()
                .trim()
                .split('\n')
                .map(query => query.trim())
                .filter(query => query.length > 0)
                .slice(0, trackCount); // Ensure we don't exceed requested count

            console.log('✅ Gemini generated search queries:', searchQueries);
            return searchQueries;

        } catch (error) {
            console.error('❌ Gemini playlist generation error:', error.message);
            // Smart fallback for playlist generation
            return this.playlistFallback(userRequest, trackCount);
        }
    }

    // 🎵 NEW: Smart fallback for playlist generation
    playlistFallback(userRequest, trackCount = 15) {
        const input = userRequest.toLowerCase();
        console.log('🔄 Using playlist fallback for:', userRequest);

        // Define fallback mappings for different playlist types
        const playlistMappings = {
            workout: ['energetic workout', 'pump up songs', 'cardio music', 'gym beats', 'fitness motivation', 'high energy', 'power rock', 'intense training', 'athletic performance', 'running music', 'exercise hits', 'motivational music', 'adrenaline rush', 'sports anthem', 'workout classics'],

            study: ['ambient study', 'chill instrumental', 'focus music', 'calm piano', 'lo-fi beats', 'peaceful sounds', 'concentration music', 'soft acoustic', 'minimalist piano', 'study vibes', 'zen music', 'quiet instrumental', 'background music', 'meditation sounds', 'peaceful ambient'],

            party: ['dance party hits', 'upbeat pop', 'club bangers', 'party anthems', 'dance floor', 'celebration music', 'fun pop songs', 'party classics', 'dance hits', 'upbeat dance', 'party vibes', 'feel good music', 'dance party', 'party favorites', 'celebration hits'],

            romantic: ['romantic love songs', 'slow ballads', 'love music', 'romantic hits', 'tender love', 'soul love songs', 'romantic classics', 'love ballads', 'intimate music', 'romantic acoustic', 'sweet love songs', 'emotional ballads', 'romantic pop', 'love duets', 'romantic soul'],

            sad: ['sad emotional songs', 'melancholy music', 'heartbreak songs', 'emotional ballads', 'sad love songs', 'deep feelings', 'sorrowful music', 'emotional indie', 'sad acoustic', 'melancholic pop', 'tearjerker songs', 'emotional rock', 'sad piano', 'broken heart songs', 'emotional hits'],

            happy: ['happy upbeat songs', 'feel good music', 'joyful pop', 'positive vibes', 'uplifting music', 'cheerful songs', 'good mood music', 'sunny day songs', 'happiness music', 'optimistic pop', 'joyful hits', 'upbeat classics', 'feel good hits', 'positive energy', 'happy classics'],

            chill: ['chill out music', 'relaxing vibes', 'mellow songs', 'laid back music', 'chill pop', 'easy listening', 'smooth music', 'relaxed acoustic', 'chill indie', 'peaceful music', 'calm vibes', 'soothing songs', 'tranquil music', 'mellow pop', 'chill classics'],

            road_trip: ['road trip songs', 'driving music', 'highway hits', 'travel songs', 'adventure music', 'open road', 'journey songs', 'car ride music', 'freedom songs', 'wanderlust music', 'road trip classics', 'travel vibes', 'driving beats', 'highway rock', 'adventure hits']
        };

        // Determine the playlist type based on keywords
        let selectedQueries = [];

        if (input.includes('workout') || input.includes('gym') || input.includes('exercise') || input.includes('fitness')) {
            selectedQueries = playlistMappings.workout;
        } else if (input.includes('study') || input.includes('focus') || input.includes('concentration')) {
            selectedQueries = playlistMappings.study;
        } else if (input.includes('party') || input.includes('dance') || input.includes('celebration')) {
            selectedQueries = playlistMappings.party;
        } else if (input.includes('romantic') || input.includes('love') || input.includes('date')) {
            selectedQueries = playlistMappings.romantic;
        } else if (input.includes('sad') || input.includes('heartbreak') || input.includes('emotional')) {
            selectedQueries = playlistMappings.sad;
        } else if (input.includes('happy') || input.includes('joy') || input.includes('upbeat')) {
            selectedQueries = playlistMappings.happy;
        } else if (input.includes('chill') || input.includes('relax') || input.includes('calm')) {
            selectedQueries = playlistMappings.chill;
        } else if (input.includes('road trip') || input.includes('drive') || input.includes('travel')) {
            selectedQueries = playlistMappings.road_trip;
        } else {
            // Generic fallback
            selectedQueries = ['popular songs', 'top hits', 'mainstream music', 'chart toppers', 'radio hits', 'trending music', 'popular artists', 'hit songs', 'music favorites', 'best songs', 'top tracks', 'popular music', 'hit parade', 'music charts', 'trending hits'];
        }

        // Return the requested number of queries
        return selectedQueries.slice(0, trackCount);
    }

    // 🎵 NEW: Generate playlist name and description
    async generatePlaylistMetadata(userRequest, foundTracks = []) {
        try {
            console.log('🎨 Generating playlist metadata for:', userRequest);

            const trackList = foundTracks.slice(0, 5).map(track =>
                `${track.title} by ${track.artist}`
            ).join(', ');

            const prompt = `Based on the user's request and the tracks found, generate a creative playlist name and description.

User request: "${userRequest}"
Sample tracks found: ${trackList}

Generate a JSON response with:
{
  "name": "Creative playlist name (max 50 characters)",
  "description": "Engaging description (max 200 characters)"
}

Make the name catchy and the description appealing. Match the mood and style of the request.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();

            // Try to parse JSON response
            try {
                const metadata = JSON.parse(text);
                console.log('✅ Generated playlist metadata:', metadata);
                return metadata;
            } catch (parseError) {
                console.log('⚠️ JSON parse failed, extracting manually');
                // Fallback extraction
                return this.metadataFallback(userRequest);
            }

        } catch (error) {
            console.error('❌ Gemini metadata generation error:', error.message);
            return this.metadataFallback(userRequest);
        }
    }

    // 🎵 NEW: Fallback for playlist metadata
    metadataFallback(userRequest) {
        const input = userRequest.toLowerCase();

        const fallbackNames = {
            workout: "💪 Power Workout Mix",
            study: "📚 Study Focus Zone",
            party: "🎉 Party Vibes",
            romantic: "💕 Love & Romance",
            sad: "😢 Emotional Journey",
            happy: "😊 Feel Good Hits",
            chill: "😌 Chill Out Sessions",
            road_trip: "🚗 Road Trip Adventures"
        };

        const fallbackDescriptions = {
            workout: "High-energy tracks to power through your workout and stay motivated",
            study: "Ambient and focus-friendly music perfect for studying and concentration",
            party: "Upbeat dance hits guaranteed to get the party started",
            romantic: "Romantic songs perfect for date nights and intimate moments",
            sad: "Emotional ballads for when you need to feel your feelings",
            happy: "Uplifting songs to brighten your day and boost your mood",
            chill: "Relaxing vibes for unwinding and taking it easy",
            road_trip: "Perfect soundtrack for your next adventure on the open road"
        };

        // Determine type and return appropriate metadata
        for (const [key, name] of Object.entries(fallbackNames)) {
            if (input.includes(key) || input.includes(key.replace('_', ' '))) {
                return {
                    name: name,
                    description: fallbackDescriptions[key]
                };
            }
        }

        // Generic fallback
        return {
            name: "🎵 AI Generated Playlist",
            description: "A personalized playlist created just for you based on your preferences"
        };
    }

    // Convert natural language to music search terms (existing function)
    async generateMusicQuery(userInput) {
        try {
            console.log('🤖 Gemini processing:', userInput);

            const prompt = `Convert this natural language music request into simple search terms that would work well with music APIs like Deezer or Spotify.

User request: "${userInput}"

Rules:
1. Return only simple keywords that describe the music
2. Focus on genre, mood, or artist names
3. Keep it short and searchable
4. Remove conversational words like "I want", "play", "find me"
5. Use music-specific terms

Examples:
"I need energetic music for working out" → "energetic workout pop"
"Play something relaxing for studying" → "ambient chill instrumental"
"I want happy upbeat songs" → "happy upbeat pop"
"Find me some sad music" → "sad emotional ballads"
"Something for a party" → "dance party hits"

Search terms:`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const searchTerms = response.text().trim().replace(/"/g, '').replace(/\n/g, ' ');

            console.log('✅ Gemini generated:', searchTerms);
            return searchTerms;

        } catch (error) {
            console.error('❌ Gemini error:', error.message);
            const fallbackTerms = this.smartFallback(userInput);
            console.log('🔄 Using smart fallback:', fallbackTerms);
            return fallbackTerms;
        }
    }

    // Smart fallback when Gemini fails (existing function)
    smartFallback(userInput) {
        const input = userInput.toLowerCase();

        let cleaned = input
            .replace(/^(i want|i need|play|find me|give me|search for)/i, '')
            .replace(/(please|for me|some|something)/g, '')
            .trim();

        const mappings = {
            'energetic music for working out': 'energetic workout music',
            'relaxing for studying': 'chill study music',
            'happy upbeat songs': 'happy upbeat pop',
            'sad music': 'sad emotional songs',
            'party music': 'dance party hits',
            'romantic music': 'romantic love songs',
            'classical music': 'classical piano',
            'rock music': 'rock classics',
            'pop music': 'pop hits',
            'hip hop': 'hip hop rap',
            'jazz music': 'smooth jazz',
            'electronic music': 'electronic dance'
        };

        for (const [phrase, replacement] of Object.entries(mappings)) {
            if (cleaned.includes(phrase)) {
                return replacement;
            }
        }

        if (cleaned.length < 3) {
            return 'popular music';
        }

        return cleaned;
    }

    // Test function to verify Gemini is working (existing function)
    async testConnection() {
        try {
            const result = await this.model.generateContent("Say hello in one word");
            const response = await result.response;
            console.log('✅ Gemini test successful:', response.text());
            return true;
        } catch (error) {
            console.error('❌ Gemini test failed:', error.message);
            return false;
        }
    }
}

module.exports = new GeminiService();