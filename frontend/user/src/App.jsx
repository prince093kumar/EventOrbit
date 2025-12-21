import React from 'react';
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

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
