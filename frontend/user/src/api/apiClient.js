import axios from "axios";

const API_URL = "http://localhost:5000/api";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to attach token
apiClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("eventorbit_user"));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default apiClient;
