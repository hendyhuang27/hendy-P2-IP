// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateProfile, deleteAccount, logout } from '../../store/slices/authSlice';
import { fetchPlaylists } from '../../store/slices/playlistSlice';
import '../../pages/Profile/Profile.css';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector(state => state.auth);
    const { playlists } = useSelector(state => state.playlist);

    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [validation, setValidation] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                avatar: user.avatar || ''
            });
        }
        dispatch(fetchPlaylists());
    }, [user, dispatch]);

    const handleInputChange = (e) => {
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

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
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

    const validateProfileForm = () => {
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

        if (formData.avatar && !isValidUrl(formData.avatar)) {
            newValidation.avatar = 'Please enter a valid URL';
        }

        setValidation(newValidation);
        return Object.keys(newValidation).length === 0;
    };

    const validatePasswordForm = () => {
        const newValidation = {};

        if (!passwordData.currentPassword) {
            newValidation.currentPassword = 'Current password is required';
        }

        if (!passwordData.newPassword) {
            newValidation.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newValidation.newPassword = 'New password must be at least 6 characters';
        }

        if (!passwordData.confirmPassword) {
            newValidation.confirmPassword = 'Please confirm your new password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newValidation.confirmPassword = 'Passwords do not match';
        }

        setValidation(newValidation);
        return Object.keys(newValidation).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (!validateProfileForm()) {
            return;
        }

        try {
            await dispatch(updateProfile({
                name: formData.name.trim(),
                email: formData.email.trim(),
                avatar: formData.avatar.trim() || null
            })).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Profile updated successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update profile'
            });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) {
            return;
        }

        try {
            await dispatch(updateProfile({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })).unwrap();

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Password updated successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update password'
            });
        }
    };

    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Delete Account?',
            text: 'This action cannot be undone. All your data will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete my account',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            const confirmResult = await Swal.fire({
                title: 'Are you absolutely sure?',
                text: 'Type "DELETE" to confirm account deletion',
                input: 'text',
                inputPlaceholder: 'Type DELETE',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Delete Account',
                preConfirm: (value) => {
                    if (value !== 'DELETE') {
                        Swal.showValidationMessage('Please type "DELETE" to confirm');
                        return false;
                    }
                    return true;
                }
            });

            if (confirmResult.isConfirmed) {
                try {
                    await dispatch(deleteAccount()).unwrap();

                    Swal.fire({
                        icon: 'success',
                        title: 'Account Deleted',
                        text: 'Your account has been permanently deleted.',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    navigate('/');
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Failed to delete account'
                    });
                }
            }
        }
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, logout'
        });

        if (result.isConfirmed) {
            dispatch(logout());
            navigate('/');
        }
    };

    const getJoinDate = () => {
        if (user?.createdAt) {
            return new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return 'Unknown';
    };

    const getTotalTracks = () => {
        return playlists.reduce((total, playlist) => total + (playlist.tracks?.length || 0), 0);
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="container py-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container py-4">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="row align-items-center">
                        <div className="col-md-3 text-center mb-4 mb-md-0">
                            <div className="avatar-container">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=667eea&color=fff&size=150`}
                                    alt={user.name}
                                    className="profile-avatar"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=667eea&color=fff&size=150`;
                                    }}
                                />
                                <div className="avatar-overlay">
                                    <i className="fas fa-camera"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h1 className="profile-name">{user.name}</h1>
                            <p className="profile-email">{user.email}</p>
                            <p className="profile-join-date">
                                <i className="fas fa-calendar-alt me-2"></i>
                                Joined {getJoinDate()}
                            </p>
                        </div>
                        <div className="col-md-3">
                            <div className="profile-stats">
                                <div className="stat-item">
                                    <h3>{playlists.length}</h3>
                                    <p>Playlists</p>
                                </div>
                                <div className="stat-item">
                                    <h3>{getTotalTracks()}</h3>
                                    <p>Songs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Navigation */}
                <div className="profile-nav">
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <i className="fas fa-user me-2"></i>
                                Profile Settings
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                                onClick={() => setActiveTab('security')}
                            >
                                <i className="fas fa-shield-alt me-2"></i>
                                Security
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'danger' ? 'active' : ''}`}
                                onClick={() => setActiveTab('danger')}
                            >
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Danger Zone
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Profile Content */}
                <div className="profile-content">
                    {/* Profile Settings Tab */}
                    {activeTab === 'profile' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3>
                                    <i className="fas fa-user me-2"></i>
                                    Profile Information
                                </h3>
                                <p>Update your account details and preferences</p>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="settings-form">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="name" className="form-label">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className={`form-control ${validation.name ? 'is-invalid' : ''}`}
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                            />
                                            {validation.name && (
                                                <div className="invalid-feedback">{validation.name}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email" className="form-label">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className={`form-control ${validation.email ? 'is-invalid' : ''}`}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter your email"
                                            />
                                            {validation.email && (
                                                <div className="invalid-feedback">{validation.email}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="avatar" className="form-label">
                                        Avatar URL
                                    </label>
                                    <input
                                        type="url"
                                        id="avatar"
                                        name="avatar"
                                        className={`form-control ${validation.avatar ? 'is-invalid' : ''}`}
                                        value={formData.avatar}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/avatar.jpg (optional)"
                                    />
                                    {validation.avatar && (
                                        <div className="invalid-feedback">{validation.avatar}</div>
                                    )}
                                    <div className="form-text">
                                        Leave empty to use a generated avatar based on your name
                                    </div>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                Update Profile
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3>
                                    <i className="fas fa-shield-alt me-2"></i>
                                    Security Settings
                                </h3>
                                <p>Manage your account security and password</p>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="settings-form">
                                <div className="form-group">
                                    <label htmlFor="currentPassword" className="form-label">
                                        Current Password *
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        className={`form-control ${validation.currentPassword ? 'is-invalid' : ''}`}
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter your current password"
                                    />
                                    {validation.currentPassword && (
                                        <div className="invalid-feedback">{validation.currentPassword}</div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="newPassword" className="form-label">
                                                New Password *
                                            </label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                name="newPassword"
                                                className={`form-control ${validation.newPassword ? 'is-invalid' : ''}`}
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter new password"
                                            />
                                            {validation.newPassword && (
                                                <div className="invalid-feedback">{validation.newPassword}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword" className="form-label">
                                                Confirm New Password *
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                className={`form-control ${validation.confirmPassword ? 'is-invalid' : ''}`}
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Confirm new password"
                                            />
                                            {validation.confirmPassword && (
                                                <div className="invalid-feedback">{validation.confirmPassword}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-key me-2"></i>
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Danger Zone Tab */}
                    {activeTab === 'danger' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3>
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    Danger Zone
                                </h3>
                                <p>Actions that cannot be undone</p>
                            </div>

                            <div className="danger-zone">
                                <div className="danger-item">
                                    <div className="danger-content">
                                        <h4>Logout</h4>
                                        <p>Sign out of your account on this device</p>
                                    </div>
                                    <button
                                        className="btn btn-outline-warning"
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Logout
                                    </button>
                                </div>

                                <div className="danger-item">
                                    <div className="danger-content">
                                        <h4>Delete Account</h4>
                                        <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                                    </div>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDeleteAccount}
                                    >
                                        <i className="fas fa-trash me-2"></i>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;