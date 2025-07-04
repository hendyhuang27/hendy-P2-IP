# 🎵 Hendy Music App - API Documentation

**Base URL:** `https://hendy-music-backend.onrender.com`  
**Version:** v1.0  
**Last Updated:** January 2025

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Music Operations](#music-operations)
4. [Playlist Management](#playlist-management)
5. [AI Features](#ai-features)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Example Responses](#example-responses)

---

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### **POST** `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "provider": "local",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

---

### **POST** `/api/auth/login`

Authenticate user with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "provider": "local"
  }
}
```

---

### **POST** `/api/auth/google`

Authenticate user with Google OAuth token.

**Request Body:**

```json
{
  "token": "google_id_token_here"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Google authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "Jane Doe",
    "email": "jane@gmail.com",
    "provider": "google",
    "profilePicture": "https://lh3.googleusercontent.com/...",
    "emailVerified": true
  }
}
```

---

### **GET** `/api/auth/me`

Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "provider": "local",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## 👤 User Management

### **GET** `/api/users/profile`

Get user profile information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profilePicture": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "playlists": [
      {
        "id": 1,
        "name": "My Favorites",
        "description": "My favorite songs",
        "isPublic": false,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### **PUT** `/api/users/profile`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe_updated"
}
```

**Response (200):**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "john_doe_updated",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### **PUT** `/api/users/change-password`

Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (200):**

```json
{
  "message": "Password changed successfully"
}
```

---

## 🎵 Music Operations

### **GET** `/api/music/search`

Search for music tracks.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `q` (required): Search query string

**Example:** `/api/music/search?q=shape%20of%20you`

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 3135556,
      "title": "Shape of You",
      "artist": "Ed Sheeran",
      "album": "÷ (Divide)",
      "duration": 233,
      "preview": "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
      "image": "https://api.deezer.com/album/14808606/image",
      "explicit": false,
      "rank": 916417
    }
  ],
  "total": 1,
  "query": "shape of you"
}
```

---

### **GET** `/api/music/chart`

Get music chart (popular tracks).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `limit` (optional): Number of tracks to return (default: 50, max: 100)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 2236483947,
      "title": "Blinding Lights",
      "artist": "The Weeknd",
      "album": "After Hours",
      "duration": 200,
      "preview": "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
      "image": "https://api.deezer.com/album/135625102/image",
      "position": 1
    }
  ],
  "total": 50
}
```

---

### **GET** `/api/music/track/:id`

Get detailed information about a specific track.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `id` (required): Track ID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 3135556,
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "album": "÷ (Divide)",
    "duration": 233,
    "preview": "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
    "image": "https://api.deezer.com/album/14808606/image",
    "explicit": false,
    "link": "https://www.deezer.com/track/3135556"
  }
}
```

---

### **GET** `/api/music/album/:id`

Get album information with tracks.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 14808606,
    "title": "÷ (Divide)",
    "artist": "Ed Sheeran",
    "releaseDate": "2017-03-03",
    "trackCount": 16,
    "duration": 2658,
    "image": "https://api.deezer.com/album/14808606/image",
    "tracks": [
      {
        "id": 3135556,
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "duration": 233,
        "preview": "https://cdns-preview-d.dzcdn.net/stream/preview.mp3"
      }
    ]
  }
}
```

---

### **GET** `/api/music/artist/:id`

Get artist information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 12345,
    "name": "Artist endpoint not fully implemented",
    "picture": null
  }
}
```

---

### **GET** `/api/music/artist/:id/top`

Get artist's top tracks.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": [],
  "message": "Artist top tracks endpoint not fully implemented"
}
```

---

## 📋 Playlist Management

### **GET** `/api/playlists`

Get all playlists for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "playlists": [
    {
      "id": 1,
      "name": "My Favorites",
      "description": "My favorite tracks",
      "isPublic": false,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "tracks": [
        {
          "id": 3135556,
          "title": "Shape of You",
          "artist": "Ed Sheeran",
          "album": "÷ (Divide)",
          "duration": 233,
          "preview": "https://cdns-preview-d.dzcdn.net/stream/preview.mp3"
        }
      ]
    }
  ]
}
```

---

### **GET** `/api/playlists/:id`

Get a specific playlist by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "playlist": {
    "id": 1,
    "name": "My Favorites",
    "description": "My favorite tracks",
    "isPublic": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "tracks": [
      {
        "id": 3135556,
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "album": "÷ (Divide)",
        "duration": 233,
        "preview": "https://cdns-preview-d.dzcdn.net/stream/preview.mp3"
      }
    ]
  }
}
```

---

### **POST** `/api/playlists`

Create a new playlist.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "Workout Mix",
  "description": "High energy songs for workouts",
  "isPublic": false
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Playlist created successfully",
  "playlist": {
    "id": 2,
    "name": "Workout Mix",
    "description": "High energy songs for workouts",
    "isPublic": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "tracks": []
  }
}
```

---

### **PUT** `/api/playlists/:id`

Update an existing playlist.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "Updated Workout Mix",
  "description": "Updated description",
  "isPublic": true
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Playlist updated successfully",
  "playlist": {
    "id": 2,
    "name": "Updated Workout Mix",
    "description": "Updated description",
    "isPublic": true,
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### **DELETE** `/api/playlists/:id`

Delete a playlist.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Playlist deleted successfully"
}
```

---

### **POST** `/api/playlists/:id/tracks`

Add a track to a playlist.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "id": 3135556,
  "title": "Shape of You",
  "artist": "Ed Sheeran",
  "album": "÷ (Divide)",
  "duration": 233,
  "preview": "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
  "image": "https://api.deezer.com/album/14808606/image"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Track added to playlist successfully",
  "playlist": {
    "id": 1,
    "name": "My Favorites",
    "tracks": [
      {
        "id": 3135556,
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "album": "÷ (Divide)"
      }
    ]
  }
}
```

---

### **DELETE** `/api/playlists/:id/tracks/:trackId`

Remove a track from a playlist.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Track removed from playlist successfully"
}
```

---

## 🤖 AI Features

### **GET** `/api/ai/test`

Test AI system connectivity and status.

**Response (200):**

```json
{
  "success": true,
  "message": "AI System Status: 4/4 components working",
  "tests": {
    "rapidApiKey": true,
    "geminiApiKey": true,
    "geminiConnection": true,
    "deezerConnection": true
  },
  "recommendations": {
    "allWorking": true,
    "canUseAI": true,
    "canSearchMusic": true,
    "canGeneratePlaylists": true
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### **POST** `/api/ai/smart-search`

AI-powered smart music search with natural language.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "query": "I need energetic music for working out"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 2236483947,
      "title": "Stronger",
      "artist": "Kanye West",
      "album": "Graduation",
      "duration": 232,
      "preview": "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
      "image": "https://api.deezer.com/album/302127/image"
    }
  ],
  "originalQuery": "I need energetic music for working out",
  "aiSearchTerms": "energetic workout music",
  "successfulSearch": "energetic workout music",
  "message": "AI found 25 songs for \"I need energetic music for working out\"",
  "debug": {
    "searchVariationsTried": 4,
    "finalSearchTerm": "energetic workout music"
  }
}
```

---

### **POST** `/api/ai/generate-playlist`

AI-powered playlist generation with automatic track curation.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "query": "Create a high-energy workout playlist",
  "trackCount": 15,
  "saveName": "AI Workout Mix"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "tracks": [
      {
        "id": 2236483947,
        "title": "Stronger",
        "artist": "Kanye West",
        "album": "Graduation",
        "duration": 232,
        "preview": "https://cdns-preview-d.dzcdn.net/stream/preview.mp3",
        "image": "https://api.deezer.com/album/302127/image"
      }
    ],
    "metadata": {
      "name": "💪 Power Workout Mix",
      "description": "High-energy tracks to power through your workout and stay motivated"
    },
    "savedPlaylist": {
      "id": 5,
      "name": "AI Workout Mix",
      "description": "High-energy tracks to power through your workout and stay motivated",
      "userId": 1,
      "isPublic": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "stats": {
      "originalQuery": "Create a high-energy workout playlist",
      "requestedCount": 15,
      "foundCount": 15,
      "searchQueries": [
        "energetic workout",
        "pump up songs",
        "cardio music",
        "gym motivation",
        "upbeat electronic"
      ],
      "totalTracksFound": 45,
      "uniqueTracksFound": 32
    }
  },
  "message": "Generated 15 tracks for your playlist: \"💪 Power Workout Mix\""
}
```

---

## ❌ Error Handling

### **Standard Error Response Format:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### **Common HTTP Status Codes:**

| Code  | Description           | Example                        |
| ----- | --------------------- | ------------------------------ |
| `200` | Success               | Request completed successfully |
| `201` | Created               | Resource created successfully  |
| `400` | Bad Request           | Invalid request data           |
| `401` | Unauthorized          | Missing or invalid token       |
| `403` | Forbidden             | Access denied                  |
| `404` | Not Found             | Resource not found             |
| `408` | Request Timeout       | Music search timeout           |
| `429` | Too Many Requests     | Rate limit exceeded            |
| `500` | Internal Server Error | Server error                   |

### **Authentication Errors:**

```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

### **Validation Errors:**

```json
{
  "success": false,
  "message": "Username, email and password are required"
}
```

### **Music Service Errors:**

```json
{
  "success": false,
  "message": "Music service configuration error"
}
```

---

## ⏱️ Rate Limiting

**Current Limits:**

- **General API**: 100 requests per minute per IP
- **Music Search**: 30 requests per minute per user
- **AI Features**: 10 requests per minute per user
- **Authentication**: 5 requests per minute per IP

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

**Rate Limit Exceeded Response (429):**

```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

---

## 🔧 Health Check

### **GET** `/api/health`

Check API health status.

**Response (200):**

```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## 📋 Example Usage

### **Complete User Journey Example:**

```javascript
// 1. Register User
const registerResponse = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "music_lover",
    email: "user@example.com",
    password: "securePass123",
  }),
});

const { token, user } = await registerResponse.json();

// 2. Search for Music
const searchResponse = await fetch("/api/music/search?q=pop%20hits", {
  headers: { Authorization: `Bearer ${token}` },
});

const { data: tracks } = await searchResponse.json();

// 3. Create Playlist
const playlistResponse = await fetch("/api/playlists", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "My Pop Hits",
    description: "Favorite pop songs",
  }),
});

const { playlist } = await playlistResponse.json();

// 4. Add Track to Playlist
const addTrackResponse = await fetch(`/api/playlists/${playlist.id}/tracks`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(tracks[0]),
});

// 5. Generate AI Playlist
const aiPlaylistResponse = await fetch("/api/ai/generate-playlist", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    query: "Create a relaxing playlist for studying",
    trackCount: 20,
    saveName: "Study Vibes",
  }),
});
```

---

## 🔗 SDK and Libraries

### **JavaScript/Node.js Example Client:**

```javascript
class HendyMusicAPI {
  constructor(baseURL = "https://hendy-music-backend.onrender.com") {
    this.baseURL = baseURL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response.json();
  }

  // Auth methods
  async register(userData) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // Music methods
  async searchMusic(query) {
    return this.request(`/api/music/search?q=${encodeURIComponent(query)}`);
  }

  async getChart(limit = 50) {
    return this.request(`/api/music/chart?limit=${limit}`);
  }

  // Playlist methods
  async getPlaylists() {
    return this.request("/api/playlists");
  }

  async createPlaylist(playlistData) {
    return this.request("/api/playlists", {
      method: "POST",
      body: JSON.stringify(playlistData),
    });
  }

  // AI methods
  async smartSearch(query) {
    return this.request("/api/ai/smart-search", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  }

  async generatePlaylist(query, options = {}) {
    return this.request("/api/ai/generate-playlist", {
      method: "POST",
      body: JSON.stringify({ query, ...options }),
    });
  }
}

// Usage
const api = new HendyMusicAPI();
const loginResponse = await api.login({
  email: "user@example.com",
  password: "password123",
});

const searchResults = await api.searchMusic("pop hits");
const aiPlaylist = await api.generatePlaylist("relaxing study music");
```

---

## 🎯 Quick Start Guide

1. **Get your API token** by registering or logging in
2. **Include the token** in all protected requests
3. **Start with music search** to find tracks
4. **Create playlists** to organize your music
5. **Use AI features** for smart search and playlist generation

**Base URL:** `https://hendy-music-backend.onrender.com`
