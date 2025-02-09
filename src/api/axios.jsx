import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://5b56-103-182-166-221.ngrok-free.app/api",
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        // Add CORS headers
        "Access-Control-Allow-Origin": "*"
    }
});

export default axiosInstance;
