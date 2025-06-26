// src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { register, googleAuth } from '../../store/slices/authSlice';
import '../../pages/Auth/Auth.css';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [validation, setValidation] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error when user starts typing
        if (validation[name]) {
            setValidation(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newValidation = {};

        if (!formData.name.trim()) {
            newValidation.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newValidation.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newValidation.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newValidation.email = 'Email is invalid';
        }

        if (!formData.password) {
            newValidation.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newValidation.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newValidation.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newValidation.confirmPassword = 'Passwords do not match';
        }

        setValidation(newValidation);
        return Object.keys(newValidation).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const result = await dispatch(register({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            })).unwrap();

            if (result.token) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            console.log('🔍 Google register success:', credentialResponse);

            const result = await dispatch(googleAuth({
                token: credentialResponse.credential // Use 'token' instead of 'credential'
            })).unwrap();

            if (result.token) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Google authentication failed:', error);
        }
    };

    const handleGoogleError = () => {
        console.error('Google authentication failed');
    };

    return (
        // REMOVED: GoogleOAuthProvider wrapper (already provided in App.jsx)
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Create Account</h2>
                        <p>Join our music community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`form-control ${validation.name ? 'is-invalid' : ''}`}
                                placeholder="Enter your full name"
                            />
                            {validation.name && (
                                <div className="invalid-feedback">{validation.name}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-control ${validation.email ? 'is-invalid' : ''}`}
                                placeholder="Enter your email"
                            />
                            {validation.email && (
                                <div className="invalid-feedback">{validation.email}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-control ${validation.password ? 'is-invalid' : ''}`}
                                placeholder="Create a password"
                            />
                            {validation.password && (
                                <div className="invalid-feedback">{validation.password}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`form-control ${validation.confirmPassword ? 'is-invalid' : ''}`}
                                placeholder="Confirm your password"
                            />
                            {validation.confirmPassword && (
                                <div className="invalid-feedback">{validation.confirmPassword}</div>
                            )}
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-auth"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        {/* FIXED: Remove width prop */}
                        <div className="google-auth">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                text="signup_with"
                                theme="outline"
                                size="large"
                                shape="rectangular"
                            // REMOVED: width="100%" - This was causing the error!
                            />
                        </div>

                        <div className="auth-footer">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="auth-link">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;