import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + "/api";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to attach token
// Interceptor to attach token
apiClient.interceptors.request.use((config) => {
    // Check for organizer specific token first
    const token = localStorage.getItem("eventorbit_organizer_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        // Fallback to user object if token not found separately
        const user = JSON.parse(localStorage.getItem("eventorbit_organizer_user"));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
});

export default apiClient;
