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
        const storedUser = localStorage.getItem('eventorbit_admin_user');
        const storedToken = localStorage.getItem('eventorbit_admin_token');
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error('Failed to parse stored admin', error);
                localStorage.removeItem('eventorbit_admin_user');
                localStorage.removeItem('eventorbit_admin_token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, requiredRole: 'admin' }),
            });
            const data = await response.json();

            if (response.ok) {
                // Ensure role is admin
                if (data.role !== 'admin') {
                    return { success: false, error: 'Access denied. Admins only.' };
                }

                setUser(data);
                setToken(data.token);
                localStorage.setItem('eventorbit_admin_user', JSON.stringify(data));
                localStorage.setItem('eventorbit_admin_token', data.token);
                return { success: true };
            } else {
                return { success: false, error: data.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Backend might be down.' };
        }
    };

    const signup = async (fullName, email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, role: 'admin' }),
            });
            const data = await response.json();

            if (response.ok) {
                setUser(data);
                setToken(data.token);
                localStorage.setItem('eventorbit_admin_user', JSON.stringify(data));
                localStorage.setItem('eventorbit_admin_token', data.token);
                return { success: true };
            } else {
                return { success: false, error: data.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Backend might be down.' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('eventorbit_admin_user');
        localStorage.removeItem('eventorbit_admin_token');
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
