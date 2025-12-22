import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Interceptor to attach token
apiClient.interceptors.request.use((config) => {
    // Check for admin specific token
    const token = localStorage.getItem("eventorbit_admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
