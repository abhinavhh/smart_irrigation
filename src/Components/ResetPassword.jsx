import { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/forgot-password', {
                email: formData.email
            });
            setMessage(response.data);
            setStep(2);
        } catch (error) {
            setMessage(error.response?.data || "Error requesting OTP");
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/verify-otp', {
                email: formData.email,
                otp: formData.otp
            });
            setMessage(response.data);
            setStep(3);
        } catch (error) {
            setMessage(error.response?.data || "Invalid OTP");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            alert(response.data);
            navigate('/login');
        } catch (error) {
            setMessage(error.response?.data || "Error resetting password");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 bg-custom-image">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
      
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-300"
              >
                Request OTP
              </button>
            </form>
          )}
      
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-300"
              >
                Verify OTP
              </button>
            </form>
          )}
      
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-300"
              >
                Reset Password
              </button>
            </form>
          )}
      
          {message && (
            <div
              className={`mt-6 text-center text-sm ${
                message.includes('Error') ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>      
    );
};

export default ResetPassword;