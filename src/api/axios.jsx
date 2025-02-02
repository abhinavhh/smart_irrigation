import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://demo-spring-y35f.onrender.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;
