import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const SessionTimeoutHandler = () => {
    const { isAuthenticated, logout } = useAuth();
    const timeoutRef = useRef(null);
    const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes

    const handleLogout = () => {
        if (isAuthenticated) {
            // Using alert as requested "pop up message"
            // We call logout first or after? Alert is blocking in most browsers.
            // If we logout first, the UI might update immediately behind the alert.
            // Requirement: "logout from panel , redirect to login page , and pop up message"
            // If we alert first, user sees "Session Expired", clicks OK, then we logout and redirect.
            // This feels slightly better UX than instant flash.

            // However, to ensure security, we should probably logout.
            // Let's Alert then Logout.
            alert("Your session is expired");
            logout();
        }
    };

    const resetTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (isAuthenticated) {
            timeoutRef.current = setTimeout(handleLogout, TIMEOUT_DURATION);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        // Initialize timer
        resetTimer();

        // Add listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [isAuthenticated, logout]);

    return null;
};

export default SessionTimeoutHandler;
