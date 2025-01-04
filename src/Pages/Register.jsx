import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
        const response = await axiosInstance.post('/auth/register', {
            name: formData.name,
            email: formData.email,
            username: formData.username,
            password: formData.password
        });
        alert(response.data);
      navigate('/login');
      } catch (error) {
        setError("Registration failed. Try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} autoComplete="name" required />
        </label>
        <label>
          Email:
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required />
        </label>
        <label>
          Username:
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange}autoComplete="username"  required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" required />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
      <p>Already registered? <a href="/login">Login here</a></p>

    </div>
  );
}

export default Register;
