import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyTickets from './pages/MyTickets';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import TermsOfService from './pages/TermsOfService';

// Placeholder Pages for now
const EventDetails = () => <div className="p-8"><h1 className="text-2xl font-bold">Event Details</h1></div>;
const SeatSelection = () => <div className="p-8"><h1 className="text-2xl font-bold">Seat Selection</h1></div>;
const Checkout = () => <div className="p-8"><h1 className="text-2xl font-bold">Checkout</h1></div>;

// Layout wrapper for protected pages
const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

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
        We're currently updating our platform to serve you better. We'll be back shortly.
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
        // Try to fetch public events to check system status
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

  if (checking) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  if (isMaintenance) return <MaintenancePage />;

  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route element={<Layout><Home /></Layout>} path="/" />

            {/* Protected Routes */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/event/:id/seats" element={<SeatSelection />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/reviews" element={<Reviews />} />
            </Route>

            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
