import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://6420-103-182-166-218.ngrok-free.app/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;
