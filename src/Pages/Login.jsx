import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
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
        const response = await axiosInstance.post('/auth/login', formData);
        localStorage.setItem("username", formData.username);
        alert(response.data);
        navigate('/home');  // Redirect to the home page on success
    } catch (error) {
        setError("Invalid username or password");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>
        Forgot your password?{" "}
        <button
          onClick={() => navigate("/reset-password")}
          style={{ color: "blue", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
        >
          Reset Password
        </button>
      </p>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
}

export default Login;
