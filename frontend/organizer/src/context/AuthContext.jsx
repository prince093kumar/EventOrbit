import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('eventorbit_organizer');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse stored organizer', error);
                localStorage.removeItem('eventorbit_organizer');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Mock Implementation for Logic Check (Replace with `api/authApi` later)
        if (email === 'org@demo.com' && password === '123456') {
            const userData = { name: 'Demo Organizer', email, role: 'organizer' };
            setUser(userData);
            localStorage.setItem('eventorbit_organizer', JSON.stringify(userData));
            return { success: true };
        }
        return { success: false, error: 'Invalid credentials' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('eventorbit_organizer');
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
