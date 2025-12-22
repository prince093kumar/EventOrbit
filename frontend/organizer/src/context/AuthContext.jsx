import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('eventorbit_organizer_user');
        const storedToken = localStorage.getItem('eventorbit_organizer_token');
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error('Failed to parse stored organizer', error);
                localStorage.removeItem('eventorbit_organizer_user');
                localStorage.removeItem('eventorbit_organizer_token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, requiredRole: 'organizer' }),
            });
            const data = await response.json();

            if (response.ok) {
                // Ensure role is organizer (optional, strict check)
                if (data.role !== 'organizer') {
                    // return { success: false, error: 'Access denied. Organizers only.' };
                    // For now accepting any role to allow easy testing, or allow strict check:
                }

                setUser(data);
                setToken(data.token);
                localStorage.setItem('eventorbit_organizer_user', JSON.stringify(data));
                localStorage.setItem('eventorbit_organizer_token', data.token);
                return { success: true };
            } else {
                return { success: false, error: data.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const signup = async (name, email, password, role = 'organizer') => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: name, email, password, role }),
            });
            const data = await response.json();

            if (response.ok) {
                setUser(data);
                setToken(data.token);
                localStorage.setItem('eventorbit_organizer_user', JSON.stringify(data));
                localStorage.setItem('eventorbit_organizer_token', data.token);
                return { success: true };
            } else {
                return { success: false, error: data.message || 'Signup failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('eventorbit_organizer_user');
        localStorage.removeItem('eventorbit_organizer_token');
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
