import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://5b56-103-182-166-221.ngrok-free.app/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;
