// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import { getCurrentUser } from './store/slices/authSlice';

// Import your components
import Home from '../src/pages/Home/Home';
import Login from '../src/pages/Auth/Login';
import Register from '../src/pages/Auth/Register';
import Dashboard from '../src/pages/Dashboard/Dashboard';
import Playlist from '../src/pages/Playlists/Playlists';
import Profile from '../src/pages/Profile/Profile';
import SearchMusic from '../src/pages/Search/Search';

import MusicTest from './components/MusicTest';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, token, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, token, isAuthenticated } = useSelector(state => state.auth);

  if (isAuthenticated && user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App Content Component
const AppContent = () => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector(state => state.auth);

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (storedToken && userData && !user) {
      // Verify token is still valid
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading MusicApp...</h4>
            <p className="text-muted">Please wait while we set up your experience</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <main className="main-content">
          <Routes>

            <Route path="/test-music" element={<MusicTest />} />
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists"
              element={
                <ProtectedRoute>
                  <Playlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Search Route */}
            <Route path="/search" element={<SearchMusic />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Root App Component with Providers
const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  console.log('🔍 Environment check:');
  console.log('- Google Client ID exists:', !!googleClientId);
  console.log('- Client ID (partial):', googleClientId ? `${googleClientId.substring(0, 20)}...` : 'Not found');

  // Error boundary for missing Google Client ID
  if (!googleClientId) {
    return (
      <div className="error-container">
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <h1 className="alert-heading">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Configuration Error
              </h1>
              <p className="mb-3">
                Google Client ID is not configured. Please check your <code>.env</code> file.
              </p>
              <hr />
              <p className="mb-0">
                Make sure you have <code>VITE_GOOGLE_CLIENT_ID</code> set in your environment variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider
      clientId={googleClientId}
      onScriptLoadError={(error) => {
        console.error('❌ Google Script Load Error:', error);
      }}
      onScriptLoadSuccess={() => {
        console.log('✅ Google OAuth Script Loaded Successfully');
      }}
    >
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;