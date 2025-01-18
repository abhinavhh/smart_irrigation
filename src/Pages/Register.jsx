import { useState } from "react";
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
    <div className="flex justify-center items-center h-screen bg-custom-image">
    <div className="w-full max-w-md bg-white p-8 bg-opacity-55 shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
      {error && <p className="text-red-600 text-center mb-4" style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Name:
          <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" type="text" id="name" name="name" value={formData.name} onChange={handleChange} autoComplete="name" required />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Email:
          <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" type="email" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Username:
          <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" type="text" id="username" name="username" value={formData.username} onChange={handleChange}autoComplete="username"  required />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Password:
          <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" required />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </label>
        <button className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" type="submit">Register</button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-600">Already registered? <a className="text-green-600 hover:underline" href="/login">Login here</a></p>

    </div>
  </div>
  );
}

export default Register;
