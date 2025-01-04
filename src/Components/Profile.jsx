import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (!username) {
            navigate('/login');
        }

        axiosInstance.get(`/user/profile/${username}`)
            .then(response => {
                setUserData(response.data);
                setFormData(response.data);
            })
            .catch(() => {
                alert("Failed to fetch user data.");
                navigate('/login');
            });
    }, [navigate, username]);

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async () => {
        try {
            await axiosInstance.put('/user/profile/update', formData);
            alert('Profile updated successfully');
            localStorage.setItem("username", formData.username);
            setUserData(formData);
            setEditing(false);
        } catch (error) {
            alert('Error updating profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div>
            <h2>User Profile</h2>
            <p>
                <strong>Username:</strong>{" "}
                {editing ? (
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                ) : (
                    userData.username
                )}
            </p>
            <p>
                <strong>Email:</strong>{" "}
                {editing ? (
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                ) : (
                    userData.email
                )}
            </p>
            <button onClick={handleEditToggle}>{editing ? "Cancel" : "Edit"}</button>
            {editing && <button onClick={handleSaveChanges}>Save Changes</button>}
            <button onClick={() => navigate('/reset-password')}>Reset Password</button>
            <button onClick={handleLogout} style={{ marginTop: "10px" }}>Logout</button>
        </div>
    );
};

export default Profile;
