import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Services/Api";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post("/auth/login", formData)
      .then((response) => {
        const token = response.data.token;
        onLogin(token); // Save token and update state
        navigate("/"); // Redirect to home page
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Invalid username or password");
      });
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
