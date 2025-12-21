import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('org@demo.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await login(email, password);
            if (res.success) {
                // Get user from context or use the local auth state if updated immediately
                // However, state update might be async, so we might need to rely on the returned data if login returned it.
                // But simplified: assuming we trust the login success means we have a user.

                // For a more robust check, we could have login return the user object.
                // Let's assume the AuthContext update triggers a re-render or we check localStorage.
                const storedUser = JSON.parse(localStorage.getItem('eventorbit_organizer'));

                if (storedUser.role === 'organizer' || storedUser.role === 'admin') {
                    navigate('/');
                } else if (storedUser.role === 'user') {
                    // Redirect to User App (Main Website)
                    window.location.href = 'http://localhost:5173';
                } else {
                    setError("Unknown role. Please contact support.");
                }
            } else {
                setError(res.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

            {/* Glass Card */}
            <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden relative z-10">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl shadow-lg mb-4 transform rotate-3 group hover:rotate-6 transition-transform">
                            <Ticket size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-page)] mb-2">Organizer Portal</h1>
                        <p className="text-[var(--text-muted)]">Sign in to manage your events & analytics</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl text-center font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-page)] pl-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-subtle)] border-none rounded-xl text-[var(--text-page)] focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all placeholder-gray-400"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-page)] pl-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-subtle)] border-none rounded-xl text-[var(--text-page)] focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-page)] transition-colors">
                                <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-500" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-yellow-600 dark:text-yellow-400 font-medium hover:underline">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Sparkles className="animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Decor */}
                <div className="bg-[var(--bg-subtle)]/50 p-4 text-center border-t border-white/10">
                    <p className="text-xs text-[var(--text-muted)]">
                        Don't have an organizer account? <a href="#" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline">Apply Here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
