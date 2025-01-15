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
        <div>
            <h2>Reset Password</h2>
            
            {step === 1 && (
                <form onSubmit={handleRequestOTP}>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Request OTP</button>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyOTP}>
                    <div>
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Verify OTP</button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleResetPassword}>
                    <div>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Reset Password</button>
                    </div>
                </form>
            )}

            {message && (
                <div style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default ResetPassword;