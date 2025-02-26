import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        // Add CORS headers
        "Access-Control-Allow-Origin": "*"
    }
});

export default axiosInstance;
