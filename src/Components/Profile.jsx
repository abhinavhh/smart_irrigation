import { useEffect, useState } from 'react';
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
            alert('Error updating profile',error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-gray-700 p-4 rounded-full mb-4">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9.003 9.003 0 0112 15c2.21 0 4.21.896 5.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold">{userData.username}</h2>
                    <p className="text-gray-400">{userData.email}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400">Username</label>
                    {editing ? (
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 mt-2 bg-gray-700 rounded"
                        />
                    ) : (
                        <p className="p-2 bg-gray-700 rounded">{userData.username}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400">Email</label>
                    {editing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 mt-2 bg-gray-700 rounded"
                        />
                    ) : (
                        <p className="p-2 bg-gray-700 rounded">{userData.email}</p>
                    )}
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                    >
                        {editing ? "Cancel" : "Edit"}
                    </button>
                    {editing && (
                        <button
                            onClick={handleSaveChanges}
                            className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
                <button
                    onClick={() => navigate('/reset-password')}
                    className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-700 text-white rounded w-full"
                >
                    Reset Password
                </button>
                <button
                    onClick={handleLogout}
                    className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded w-full"
                >
                    Logout
                </button>
            </div>

        </div>
    
);
};

export default Profile;
