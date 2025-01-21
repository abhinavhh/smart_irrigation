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
            alert('Error updating profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 ">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">User Profile</h2>
            <div className="flex items-center justify-center">
            <div id="profile" className="flex items-center justify-center bg-blue-500 text-white font-bold rounded-full h-16 w-16"><img src="https://icon-library.com/images/flat-user-icon/flat-user-icon-12.jpg" alt="user icon" /></div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-600 font-medium">
                    Username:
                </label>
                {editing ? (
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                ) : (
                    <p className="text-gray-800">{userData.username}</p>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-gray-600 font-medium">
                    Email:
                </label>
                {editing ? (
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                ) : (
                    <p className="text-gray-800">{userData.email}</p>
                )}
            </div>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handleEditToggle}
                    className={`px-6 py-2 text-white rounded-full ${editing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    {editing ? "Cancel" : "Edit"}
                </button>
                {editing && (
                    <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-600"
                    >
                        Save Changes
                    </button>
                )}
            </div>
            <button
                onClick={() => navigate('/reset-password')}
                className="w-full px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-600 mb-4"
            >
                Reset Password
            </button>
            <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-white bg-red-500 rounded-full hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    </div>
);
};

export default Profile;