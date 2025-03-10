import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://demo-spring-1.onrender.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;
