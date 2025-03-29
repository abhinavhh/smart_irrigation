import axios from "axios";

const myBaseUrl = import.meta.env.VITE_BACKEND_URL;
const axiosInstance = axios.create({
    baseURL: myBaseUrl,

    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;
