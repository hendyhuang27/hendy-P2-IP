// src/pages/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../pages/Home/Home.css';

const Home = () => {
    const features = [
        {
            icon: 'fas fa-music',
            title: 'Discover Music',
            description: 'Explore millions of songs from your favorite artists and discover new ones.'
        },
        {
            icon: 'fas fa-list',
            title: 'Create Playlists',
            description: 'Organize your favorite tracks into custom playlists for every mood.'
        },
        {
            icon: 'fas fa-users',
            title: 'Share & Connect',
            description: 'Share your playlists with friends and discover what they\'re listening to.'
        },
        {
            icon: 'fas fa-mobile-alt',
            title: 'Listen Anywhere',
            description: 'Access your music library from any device, anytime, anywhere.'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Music Enthusiast',
            avatar: '/avatars/avatar1.jpg',
            text: 'This platform has completely changed how I discover and organize my music. The playlist features are incredible!'
        },
        {
            name: 'Mike Chen',
            role: 'Producer',
            avatar: '/avatars/avatar2.jpg',
            text: 'As a music producer, I love being able to quickly find and organize tracks for my projects. Game-changer!'
        },
        {
            name: 'Emma Davis',
            role: 'Student',
            avatar: '/avatars/avatar3.jpg',
            text: 'Perfect for studying! I can create the perfect playlists for different subjects and moods.'
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-overlay"></div>
                </div>
                <div className="container">
                    <div className="row align-items-center min-vh-100">
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <h1 className="hero-title">
                                    Your Music,
                                    <span className="highlight"> Your Way</span>
                                </h1>
                                <p className="hero-description">
                                    Discover, create, and share the perfect playlists.
                                    Join millions of music lovers in the ultimate music experience.
                                </p>
                                <div className="hero-buttons">
                                    <Link to="/register" className="btn btn-primary btn-lg me-3">
                                        Get Started Free
                                        <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                    <Link to="/login" className="btn btn-outline-light btn-lg">
                                        Sign In
                                    </Link>
                                </div>
                                <div className="hero-stats">
                                    <div className="stat-item">
                                        <h3>10M+</h3>
                                        <p>Songs</p>
                                    </div>
                                    <div className="stat-item">
                                        <h3>1M+</h3>
                                        <p>Users</p>
                                    </div>
                                    <div className="stat-item">
                                        <h3>500K+</h3>
                                        <p>Playlists</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-image">
                                <div className="music-player-mockup">
                                    <div className="player-header">
                                        <div className="player-controls">
                                            <div className="control-btn"></div>
                                            <div className="control-btn"></div>
                                            <div className="control-btn"></div>
                                        </div>
                                    </div>
                                    <div className="player-content">
                                        <div className="album-art"></div>
                                        <div className="track-info">
                                            <div className="track-title"></div>
                                            <div className="track-artist"></div>
                                        </div>
                                        <div className="player-controls-main">
                                            <div className="control-icon"></div>
                                            <div className="control-icon main"></div>
                                            <div className="control-icon"></div>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Why Choose Our Platform?</h2>
                        <p>Everything you need to enjoy music to the fullest</p>
                    </div>
                    <div className="row g-4">
                        {features.map((feature, index) => (
                            <div key={index} className="col-lg-3 col-md-6">
                                <div className="feature-card">
                                    <div className="feature-icon">
                                        <i className={feature.icon}></i>
                                    </div>
                                    <h4>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>How It Works</h2>
                        <p>Get started in three simple steps</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <h4>Sign Up</h4>
                                <p>Create your free account in seconds with email or Google sign-in.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="step-card">
                                <div className="step-number">2</div>
                                <h4>Discover Music</h4>
                                <p>Search through millions of songs and find your next favorite track.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="step-card">
                                <div className="step-number">3</div>
                                <h4>Create Playlists</h4>
                                <p>Organize your music into playlists and share them with the world.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>What Our Users Say</h2>
                        <p>Join thousands of satisfied music lovers</p>
                    </div>
                    <div className="row g-4">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="col-lg-4">
                                <div className="testimonial-card">
                                    <div className="testimonial-content">
                                        <p>"{testimonial.text}"</p>
                                    </div>
                                    <div className="testimonial-author">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=667eea&color=fff`;
                                            }}
                                        />
                                        <div className="author-info">
                                            <h5>{testimonial.name}</h5>
                                            <p>{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content text-center">
                        <h2>Ready to Start Your Music Journey?</h2>
                        <p>Join millions of music lovers and create your perfect playlists today.</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary btn-lg me-3">
                                Start Free Today
                                <i className="fas fa-music ms-2"></i>
                            </Link>
                            <Link to="/login" className="btn btn-outline-primary btn-lg">
                                Already have an account?
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="footer-brand">
                                <h4>MusicApp</h4>
                                <p>Your ultimate music companion for discovering, organizing, and sharing your favorite tracks.</p>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4">
                            <div className="footer-links">
                                <h5>Product</h5>
                                <ul>
                                    <li><Link to="/features">Features</Link></li>
                                    <li><Link to="/pricing">Pricing</Link></li>
                                    <li><Link to="/download">Download</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4">
                            <div className="footer-links">
                                <h5>Company</h5>
                                <ul>
                                    <li><Link to="/about">About</Link></li>
                                    <li><Link to="/careers">Careers</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4">
                            <div className="footer-links">
                                <h5>Support</h5>
                                <ul>
                                    <li><Link to="/help">Help Center</Link></li>
                                    <li><Link to="/privacy">Privacy</Link></li>
                                    <li><Link to="/terms">Terms</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="footer-social">
                                <h5>Follow Us</h5>
                                <div className="social-links">
                                    <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                                    <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                                    <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                                    <a href="#" aria-label="Spotify"><i className="fab fa-spotify"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="footer-divider" />
                    <div className="footer-bottom">
                        <p>&copy; 2024 MusicApp. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;