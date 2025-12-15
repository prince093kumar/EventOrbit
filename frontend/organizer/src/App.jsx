import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import LiveMonitor from './pages/LiveMonitor';
import Attendees from './pages/Attendees';
import Revenue from './pages/Revenue';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

// Simple Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="create-event" element={<CreateEvent />} />
                    <Route path="live-monitor" element={<LiveMonitor />} />
                    <Route path="attendees" element={<Attendees />} />
                    <Route path="revenue" element={<Revenue />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
