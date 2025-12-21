import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { User, Mail, Shield, Key, Smartphone, MapPin, CheckCircle, Save, Loader2, Camera, Lock, Eye, EyeOff, X } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Admin Data State
    const [adminDetails, setAdminDetails] = useState({
        name: '',
        email: '',
        role: 'Super Admin',
        phone: '',
        location: ''
    });

    // Password State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setAdminDetails({
                name: user.fullName || '',
                email: user.email || '',
                role: user.role || 'Admin',
                phone: user.phone || '',
                location: user.location || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setAdminDetails({ ...adminDetails, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            // Using generic auth profile update since admin specific route doesn't exist/isn't needed
            const res = await apiClient.put('/auth/profile', {
                fullName: adminDetails.name,
                phone: adminDetails.phone,
                location: adminDetails.location
            });

            if (res.data.success) {
                setSuccessMsg('Profile updated successfully!');

                // Update local storage to reflect changes immediately
                const currentUser = JSON.parse(localStorage.getItem('eventorbit_admin_user'));
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...res.data };
                    // Ensure token is preserved if returned, else keep old
                    localStorage.setItem('eventorbit_admin_user', JSON.stringify(updatedUser));
                }
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setErrorMsg(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMsg(''), 3000);
        }
    };

    // Password Handlers
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    const togglePasswordVisibility = (field) => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setPasswordError("New passwords don't match");
        }
        if (passwordData.newPassword.length < 8) {
            return setPasswordError("Password must be at least 8 characters");
        }

        setPasswordLoading(true);
        try {
            const res = await apiClient.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (res.data.success) {
                setPasswordSuccess('Password changed successfully!');
                setTimeout(() => {
                    setIsPasswordModalOpen(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordSuccess('');
                }, 1500);
            }
        } catch (error) {
            setPasswordError(error.response?.data?.message || "Failed to update password");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-page)]">Your Profile</h1>
                <p className="text-[var(--text-muted)] mt-2">Manage your admin profile and security settings.</p>
            </div>

            {/* Main Profile Card */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
                {/* Gradient Banner */}
                <div className="h-32 bg-gradient-to-r from-[#FFDA8A] to-[#ffc107]"></div>

                <div className="px-8 pb-8 relative">
                    {/* Avatar (Overlapping) */}
                    <div className="absolute -top-12 left-8">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full p-1 shadow-lg overflow-hidden border-2 border-white dark:border-slate-800">
                                <div className="w-full h-full bg-gradient-to-br from-violet-100 to-violet-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-violet-600 dark:text-violet-300">
                                    {adminDetails.name.charAt(0) || <User size={32} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Header */}
                    <div className="pt-16 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-page)]">{adminDetails.name || 'Admin User'}</h2>
                            <p className="text-[var(--text-muted)]">{adminDetails.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#FFDA8A]/20 text-orange-700 dark:text-[#FFDA8A]">
                                    <Shield size={10} /> {adminDetails.role}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                    <CheckCircle size={10} /> Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleUpdateProfile} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-page)] flex items-center gap-2">
                                    <User size={16} className="text-[#FFDA8A]" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={adminDetails.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all"
                                />
                            </div>

                            {/* Email (Disabled) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-page)] flex items-center gap-2">
                                    <Mail size={16} className="text-[#FFDA8A]" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={adminDetails.email}
                                    disabled
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-slate-800/80 border border-[var(--border-color)] rounded-xl text-[var(--text-muted)] cursor-not-allowed"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-page)] flex items-center gap-2">
                                    <Smartphone size={16} className="text-[#FFDA8A]" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={adminDetails.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all"
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-page)] flex items-center gap-2">
                                    <MapPin size={16} className="text-[#FFDA8A]" /> Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={adminDetails.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-color)]">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 font-semibold rounded-xl shadow-lg shadow-[#FFDA8A]/20 transition-all flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Changes
                            </button>
                            {successMsg && <span className="text-green-600 font-medium animate-in fade-in">{successMsg}</span>}
                            {errorMsg && <span className="text-red-600 font-medium animate-in fade-in">{errorMsg}</span>}
                        </div>
                    </form>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg"><Lock size={20} /></div>
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-page)]">Security & Password</h3>
                        <p className="text-sm text-[var(--text-muted)]">Manage your account security.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Password Change */}
                    <div className="flex items-center justify-between p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-page)]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                                <Key size={18} />
                            </div>
                            <div>
                                <p className="font-medium text-[var(--text-page)]">Login Password</p>
                                <p className="text-sm text-[var(--text-muted)]">Ensure your account is using a strong password.</p>
                            </div>
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

            {/* Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Change Password</h3>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500"><X size={20} /></button>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                            {passwordError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{passwordError}</div>}
                            {passwordSuccess && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg">{passwordSuccess}</div>}

                            {[{ name: 'currentPassword', label: 'Current Password', showKey: 'current' }, { name: 'newPassword', label: 'New Password', showKey: 'new' }, { name: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm' }].map((field) => (
                                <div key={field.name} className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{field.label}</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords[field.showKey] ? "text" : "password"}
                                            name={field.name}
                                            value={passwordData[field.name]}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FFDA8A]/50 pr-12"
                                            placeholder="••••••"
                                        />
                                        <button type="button" onClick={() => togglePasswordVisibility(field.showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPasswords[field.showKey] ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                    </div>
                                </div>
                            ))}
                            <button type="submit" disabled={passwordLoading} className="w-full px-6 py-3 bg-[#FFDA8A] font-semibold rounded-xl mt-2 flex justify-center gap-2">
                                {passwordLoading ? <Loader2 className="animate-spin" /> : <Save />} Update Password
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
