import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ShieldCheck, ArrowRight, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    // Role selection: 'user', 'organizer', 'admin'
    const [activeRole, setActiveRole] = useState('user');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { success, error } = await login(formData.email, formData.password, activeRole);

        if (success) {
            navigate(from, { replace: true });
        } else {
            setError(error || 'Failed to login');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)]">
                {/* Header */}
                <div className="relative p-8 text-center bg-gradient-to-br from-[#FFDA8A] to-[#ffc107] text-gray-900">
                    <Link to="/" className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-gray-900 transition-colors" title="Back to Home">
                        <ArrowLeft size={20} />
                    </Link>
                    <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                    <p className="text-gray-800">Sign in to access your dashboard.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-page)] mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-[var(--text-page)]">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-medium text-[#FFDA8A] hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 focus:border-[#FFDA8A] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#FFDA8A]/30 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-[var(--text-muted)]">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-[#FFDA8A] hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
