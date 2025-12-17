import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import LiveMonitor from './pages/LiveMonitor';
import Attendees from './pages/Attendees';
import Revenue from './pages/Revenue';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useAuth } from './context/AuthContext';

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

function App() {
    return (
        <Router>
            <SessionTimeoutHandler />
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
                    <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
