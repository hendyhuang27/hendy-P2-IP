// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { login, googleAuth, clearError } from '../../store/slices/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [validation, setValidation] = useState({});
    const [googleLoading, setGoogleLoading] = useState(false);

    // Clear errors when component mounts
    React.useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error
        if (validation[name]) {
            setValidation(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newValidation = {};

        if (!formData.email.trim()) {
            newValidation.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newValidation.email = 'Email is invalid';
        }

        if (!formData.password) {
            newValidation.password = 'Password is required';
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
            const result = await dispatch(login({
                email: formData.email.trim(),
                password: formData.password
            })).unwrap();

            if (result.token) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);

        try {
            console.log('🔍 Google login success:', credentialResponse);

            if (!credentialResponse.credential) {
                throw new Error('No credential received from Google');
            }

            const result = await dispatch(googleAuth({
                token: credentialResponse.credential
            })).unwrap();

            if (result.token) {
                console.log('✅ Google auth successful, redirecting...');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('❌ Google authentication failed:', error);
            // Clear loading state on error
            setGoogleLoading(false);
        }
    };

    const handleGoogleError = (error) => {
        console.error('❌ Google authentication error:', error);
        setGoogleLoading(false);

        // Show user-friendly error message
        alert('Google sign-in failed. Please try again or use email/password login.');
    };

    return (
        <div className="auth-page">
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="row w-100 justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <h2 className="card-title mb-2">Welcome Back</h2>
                                    <p className="text-muted">Sign in to your account</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email Address</label>
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

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`form-control ${validation.password ? 'is-invalid' : ''}`}
                                            placeholder="Enter your password"
                                        />
                                        {validation.password && (
                                            <div className="invalid-feedback">{validation.password}</div>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mb-3"
                                        disabled={loading}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            padding: '12px',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Signing In...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </button>

                                    <div className="text-center mb-3">
                                        <span className="text-muted">or</span>
                                    </div>

                                    {/* Improved Google Sign-In Button */}
                                    <div className="d-grid">
                                        {googleLoading ? (
                                            <button
                                                className="btn btn-outline-secondary"
                                                disabled
                                                style={{ padding: '12px' }}
                                            >
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Connecting to Google...
                                            </button>
                                        ) : (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                minHeight: '44px',
                                                alignItems: 'center'
                                            }}>
                                                <GoogleLogin
                                                    onSuccess={handleGoogleSuccess}
                                                    onError={handleGoogleError}
                                                    text="signin_with"
                                                    theme="outline"
                                                    size="large"
                                                    shape="rectangular"
                                                    locale="en"
                                                    auto_select={false}
                                                    use_fedcm_for_prompt={false}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center mt-4">
                                        <p className="mb-0">
                                            Don't have an account?{' '}
                                            <Link to="/register" className="text-primary text-decoration-none">
                                                Sign up here
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;