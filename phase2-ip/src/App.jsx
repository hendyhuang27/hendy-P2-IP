// src/App.jsx - COPY THIS ENTIRE FILE
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import { getCurrentUser } from './store/slices/authSlice';

// Import Components
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Search from './pages/Search/Search';
import Playlists from './pages/Playlists/Playlists';
import Profile from './pages/Profile/Profile';
import Home from './pages/Home/Home';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import Navbar from './components/Navbar/Navbar';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, token } = useSelector(state => state.auth);

  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <MusicPlayer />
    </div>
  );
};

// Public Route Component (redirects if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, token } = useSelector(state => state.auth);

  if (isAuthenticated && user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Loading Screen Component
const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-light mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-white">Loading Hendy Music...</h4>
        <p className="text-white-50">Setting up your music experience</p>
      </div>
    </div>
  </div>
);

// Main App Content Component
const AppContent = () => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector(state => state.auth);

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (storedToken && userData && !user) {
      console.log('🔄 Found stored token, getting current user...');
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
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
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <Playlists />
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

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

// Root App Component with Providers
const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Error boundary for missing Google Client ID
  if (!googleClientId) {
    return (
      <div className="error-container">
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
          <div className="alert alert-danger text-center" role="alert">
            <h4 className="alert-heading">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Configuration Error
            </h4>
            <p>Google Client ID is not configured. Please check your <code>.env</code> file.</p>
            <hr />
            <p className="mb-0">
              Make sure you have <code>VITE_GOOGLE_CLIENT_ID</code> set in your environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;