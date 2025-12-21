import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser, logoutUser } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cleanup legacy keys if any
        localStorage.removeItem('user');

        // Check local storage for persisted user on mount
        const storedUser = localStorage.getItem('eventorbit_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse stored user', error);
                localStorage.removeItem('eventorbit_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role) => {
        try {
            const userData = await loginUser(email, password, role);
            setUser(userData);
            localStorage.setItem('eventorbit_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signup = async (name, email, password, role) => {
        try {
            // Fix: Construct object expected by authApi AND map 'name' to 'fullName' for backend
            const payload = {
                fullName: name,
                email,
                password,
                role
            };
            const userData = await signupUser(payload);
            setUser(userData);
            localStorage.setItem('eventorbit_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
            localStorage.removeItem('eventorbit_user');
            return true;
        } catch (error) {
            console.error('Logout failed', error);
            return false;
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        role: user?.role,
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
