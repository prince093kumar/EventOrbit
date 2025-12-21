import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

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

        const { success, error } = await login(formData.email, formData.password);

        if (success) {
            navigate('/');
        } else {
            setError(error || 'Failed to login');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)]">
                {/* Header */}
                <div className="relative p-8 text-center bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
                    <Link to="/" className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors" title="Back to Home">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Admin Portal</h2>
                    <p className="text-blue-100">Secure access for system administrators.</p>
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
                                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    placeholder="admin@eventorbit.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-[var(--text-page)]">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-[var(--text-page)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span>Sign In to Dashboard</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="mt-6 text-center">
                        <div className="mb-4">
                            <p className="text-sm text-[var(--text-muted)]">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
                                    Create an Account
                                </Link>
                            </p>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                            EventOrbit Admin Panel &copy; 2024
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
