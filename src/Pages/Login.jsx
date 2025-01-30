import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      localStorage.setItem("username", formData.username);
      localStorage.setItem("userId", response.data.userId);
      alert(response.data.message);
      navigate("/home");
    } catch (error) {
      setError("Invalid username or password",error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-sm bg-gray-800 p-8 shadow-lg rounded-xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">USER LOGIN</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-10 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-10 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-400">
              <input type="checkbox" className="form-checkbox text-green-500" />
              <span className="ml-2">Remember me</span>
            </label>
            <button
              onClick={() => navigate("/reset-password")}
              className="text-sm text-green-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            LOGIN
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-400">
          Don&apos;t have an account? {" "}
          <a href="/register" className="text-green-400 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
