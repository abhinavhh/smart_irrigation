import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit3, FiSave, FiLogOut, FiUser, FiKey } from 'react-icons/fi';


const Profile = () => {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (!username) {
            alert("user not found");
            navigate('/login');
        }
        console.log("Username being sent to backend:", username);
        axiosInstance.get(`/user/${username}`)
            .then(response => {
                setUserData(response.data);
                setFormData(response.data);
            })
            .catch(error => {
                if (error.response) {
                    alert("Failed to fetch user data: " + error.response.data);
                } else {
                    alert("Error: " + error.message);
                }
                navigate('/login');
            });
    }, [username, navigate]);

    const handleEditToggle = () => {
        setEditing(!editing);
        if (!editing) {
            // Reset form data to current user data when starting to edit
            setFormData(userData);
        }
    };

    const handlePasswordReset = () => {
        navigate('/reset-password');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async () => {
        try {
            const currentUsername = userData.username;
            const response = await axiosInstance.put(`/user/update?currentUsername=${currentUsername}`, {
                username: formData.username,
                email: formData.email,
            });
            // Update both userData and formData with the response
            setUserData(response.data);
            setFormData(response.data);
            localStorage.setItem("username", response.data.username);
            alert('Profile updated successfully');
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
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-10">
            <FiUser className="text-6xl mb-4" />
            <h2 className="text-2xl font-semibold">{userData.username}</h2>
            <p className="text-md text-gray-400 mb-4">{userData.email}</p>
            
            {/* Edit Button */}
            <button
                onClick={handleEditToggle}
                className={`px-3 py-2 rounded-lg text-white font-medium transition ${
                    editing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                } mb-4`}
            >
                {editing ? "Cancel" : "Edit Profile"} <FiEdit3 className="inline ml-2" />
            </button>

            {/* Profile Details */}
            <div className="w-full max-w-md">
                {/* Username */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-300">Username</label>
                    {editing ? (
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-blue-500 text-white"
                        />
                    ) : (
                        <p className="px-4 py-3 bg-gray-800 rounded-lg text-gray-300">{userData.username}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-300">Email</label>
                    {editing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-blue-500 text-white"
                        />
                    ) : (
                        <p className="px-4 py-3 bg-gray-800 rounded-lg text-gray-300">{userData.email}</p>
                    )}
                </div>
                <div className='flex flex-1 justify-center gap-2'>
                {/* Save Changes Button */}
                {editing && (
                    <button
                        onClick={handleSaveChanges}
                        className=" px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium "
                    >
                        Save Changes <FiSave className="inline ml-2" />
                    </button>
                )}
                {/* Password Reset Button */}
                <button
                    onClick={handlePasswordReset}
                    className=" px-4 py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-lg font-medium mb-"
                >
                    Reset Password <FiKey className="inline ml-2" />
                </button>
                  
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className=" px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
                Logout <FiLogOut className="inline ml-2" />
            </button>
                </div>

                
            </div>
          
        </div>
    );
};

export default Profile;