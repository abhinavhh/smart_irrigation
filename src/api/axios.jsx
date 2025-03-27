import axios from "axios";
const myBaseURL = import.meta.env.VITE_BACKEND_URL;
const axiosInstance = axios.create({
    baseURL: myBaseURL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;
