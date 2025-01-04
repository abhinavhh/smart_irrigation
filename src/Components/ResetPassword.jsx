import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ token: '', newPassword: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/reset-password', formData);
            alert(response.data);
            navigate('/login');
        } catch (error) {
            setMessage("Error resetting password. Try again.");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="token"
                    placeholder="Enter your reset token"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter your new password"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
