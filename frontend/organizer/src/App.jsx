
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import LiveMonitor from './pages/LiveMonitor';
import Attendees from './pages/Attendees';
import Revenue from './pages/Revenue';
import Profile from './pages/Profile';
import KYC from './pages/KYC';
import Notifications from './pages/Notifications';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import GateKeeper from './pages/GateKeeper';
import { useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import SessionTimeoutHandler from './components/SessionTimeoutHandler';

// Simple Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] text-[var(--text-page)]">Loading...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const MaintenancePage = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-700">
            <div className="w-16 h-16 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Under Maintenance</h1>
            <p className="text-slate-400 mb-6">
                The organizer dashboard is currently offline for scheduled maintenance.
            </p>
            <div className="animate-pulse w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-violet-600 w-1/2 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
        </div>
    </div>
);

function App() {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                // Try to fetch public events (or any protected route if needed, but public is safer to check availability)
                // Using /api/events as a probe
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                await axios.get(`${API_URL}/api/events`);
                setIsMaintenance(false);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    setIsMaintenance(true);
                }
            } finally {
                setChecking(false);
            }
        };
        checkStatus();
    }, []);

    if (checking) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] text-[var(--text-page)]">Loading...</div>;
    if (isMaintenance) return <MaintenancePage />;
    return (
        <Router>
            <SessionTimeoutHandler />
            <NotificationProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Dashboard Layout Routes */}
                    <Route path="/" element={<DashboardLayout />}>
                        {/* Dashboard is accessible to guests (Guest Mode handled inside) */}
                        <Route index element={<Dashboard />} />

                        {/* Protected Routes */}
                        <Route path="create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                        <Route path="live-monitor" element={<ProtectedRoute><LiveMonitor /></ProtectedRoute>} />
                        <Route path="attendees" element={<ProtectedRoute><Attendees /></ProtectedRoute>} />
                        <Route path="revenue" element={<ProtectedRoute><Revenue /></ProtectedRoute>} />
                        <Route path="kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
                        <Route path="scan" element={<ProtectedRoute><GateKeeper /></ProtectedRoute>} />
                        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                    </Route>
                </Routes>
            </NotificationProvider>
        </Router>
    );
}

export default App;
