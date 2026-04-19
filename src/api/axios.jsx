import axios from "axios";

const myBaseUrl = import.meta.env.VITE_BACKEND_URL;
const axiosInstance = axios.create({
    baseURL: myBaseUrl,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    
    // Check if the request is an auth request
    const isAuthRequest = config.url.includes("/auth/");

    if (!isAuthRequest) {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // No token for a protected route - logout
            localStorage.clear();
            window.location.href = "/";
            return Promise.reject("No authentication token found");
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor
axiosInstance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
    }
    return Promise.reject(error);
});

export default axiosInstance;
