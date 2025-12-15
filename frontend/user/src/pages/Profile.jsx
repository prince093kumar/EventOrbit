import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api/authApi';
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Shield, Loader2, X, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/canvasUtils';
import { indianCities } from '../utils/cities';

const Profile = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Cropper State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Load persisted avatar on mount
    useEffect(() => {
        const savedAvatar = localStorage.getItem('user_avatar');
        if (savedAvatar) {
            setAvatarPreview(savedAvatar);
        }
    }, []);

    // Location Autocomplete State
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Password Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [lastPasswordChange, setLastPasswordChange] = useState(
        localStorage.getItem('password_last_changed') || '3 months ago'
    );


    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: ''
    });

    // Load user data when available - prioritize localStorage for persisted edits
    useEffect(() => {
        const savedProfile = localStorage.getItem('user_profile_data');
        if (savedProfile) {
            setFormData(JSON.parse(savedProfile));
        } else if (user) {
            setFormData({
                fullName: user.fullName || user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, location: value });

        if (value.length > 0) {
            // Filter from the imported static list
            const filtered = indianCities.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 10); // Limit to 10 suggestions for performance
            setCitySuggestions(filtered);
            setShowCitySuggestions(true);
        } else {
            setShowCitySuggestions(false);
        }
    };

    const selectCity = (city) => {
        setFormData({ ...formData, location: city });
        setShowCitySuggestions(false);
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        setPasswordLoading(true);
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);

            setPasswordSuccess('Password changed successfully!');

            // Update last changed date
            const newDate = 'Just now';
            setLastPasswordChange(newDate);
            localStorage.setItem('password_last_changed', new Date().toLocaleDateString());

            // Reset form and close modal after delay
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setPasswordSuccess('');
                // After modal closes, show actual date or keep 'Just now' until refresh
                setLastPasswordChange('Just now');
            }, 1500);

        } catch (error) {
            setPasswordError(error.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Persist to localStorage
        localStorage.setItem('user_profile_data', JSON.stringify(formData));

        setLoading(false);
        setSuccessMsg('Profile updated successfully!');

        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setIsCropperOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            setAvatarPreview(croppedImage);

            // Persist avatar to localStorage
            localStorage.setItem('user_avatar', croppedImage);

            setIsCropperOpen(false);
            // Optionally reset input
            if (fileInputRef.current) fileInputRef.current.value = null;
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">

            {/* Cropper Modal */}
            {isCropperOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Adjust Photo</h3>
                            <button onClick={() => setIsCropperOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="relative h-80 w-full bg-black">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                maxZoom={3}
                            />
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <ZoomOut size={20} className="text-gray-400" />
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FFDA8A]"
                                />
                                <ZoomIn size={20} className="text-gray-400" />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsCropperOpen(false)}
                                    className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={showCroppedImage}
                                    className="px-5 py-2.5 text-sm font-semibold bg-[#FFDA8A] text-gray-900 hover:bg-[#ffc107] rounded-xl transition-colors shadow-lg shadow-[#FFDA8A]/20"
                                >
                                    Save Photo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-page)]">Your Profile</h1>
                <p className="text-[var(--text-muted)] mt-2">Manage your personal information and preferences.</p>
            </div>

            {/* Main Profile Card */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
                {/* Cover / Header Area */}
                <div className="h-32 bg-gradient-to-r from-[#FFDA8A] to-[#ffc107]"></div>

                <div className="px-8 pb-8 relative">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-8">
                        <div className="relative group">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full p-1 shadow-lg overflow-hidden">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-800"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-300">
                                        {formData.fullName?.charAt(0) || <User size={32} />}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleImageClick}
                                className="absolute bottom-1 right-1 p-2 bg-[#FFDA8A] text-gray-900 rounded-full shadow-lg hover:bg-[#ffc107] transition-transform hover:scale-105"
                                title="Change Photo"
                                type="button"
                            >
                                <Camera size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Header Info */}
                    <div className="pt-16 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-page)]">{formData.fullName || 'Guest User'}</h2>
                            <p className="text-[var(--text-muted)]">{formData.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#FFDA8A]/20 text-orange-700 dark:text-[#FFDA8A]">
                                    <Shield size={10} /> User
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-page)] flex items-center gap-2">
                                    <User size={16} className="text-[#FFDA8A]" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email (Read Only) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-page)] flex items-center gap-2">
                                    <Mail size={16} className="text-[#FFDA8A]" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-slate-800/80 border border-[var(--border-color)] rounded-xl text-[var(--text-muted)] cursor-not-allowed"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-page)] flex items-center gap-2">
                                    <Phone size={16} className="text-[#FFDA8A]" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium text-[var(--text-page)] flex items-center gap-2">
                                    <MapPin size={16} className="text-[#FFDA8A]" /> Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleLocationChange}
                                    onFocus={() => {
                                        if (formData.location) setShowCitySuggestions(true);
                                    }}
                                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all"
                                    placeholder="Type city name..."
                                />
                                {showCitySuggestions && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                        {citySuggestions.length > 0 ? (
                                            citySuggestions.map((city, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => selectCity(city)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    {city}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-[var(--text-muted)]">No cities found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-color)]">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 font-semibold rounded-xl shadow-lg shadow-[#FFDA8A]/20 transition-all flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Changes
                            </button>

                            {successMsg && (
                                <span className="text-green-600 dark:text-green-400 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                                    {successMsg}
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Change Password</h3>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                            {passwordError && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg">
                                    {passwordSuccess}
                                </div>
                            )}

                            {[
                                { name: 'currentPassword', label: 'Current Password', showKey: 'current' },
                                { name: 'newPassword', label: 'New Password', showKey: 'new' },
                                { name: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm' }
                            ].map((field) => (
                                <div key={field.name} className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--text-page)]">{field.label}</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords[field.showKey] ? "text" : "password"}
                                            name={field.name}
                                            value={passwordData[field.name]}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all pr-12"
                                            placeholder="••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility(field.showKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                        >
                                            {showPasswords[field.showKey] ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="w-full px-6 py-3 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 font-semibold rounded-xl shadow-lg shadow-[#FFDA8A]/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {passwordLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Security Section */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-page)]">Security & Password</h3>
                        <p className="text-sm text-[var(--text-muted)]">Manage your account security.</p>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-page)]">
                    <div>
                        <p className="font-medium text-[var(--text-page)]">Login Password</p>
                        <p className="text-sm text-[var(--text-muted)]">Last changed: {lastPasswordChange}</p>
                    </div>
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-[var(--border-color)] rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
