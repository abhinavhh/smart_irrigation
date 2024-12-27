import React, { useState, useEffect } from "react";
import axiosInstance from "../Services/Api";
import { useNavigate } from "react-router-dom";

function Profile({ onLogout }) {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ username: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/user/profile")
      .then((response) => {
        setProfile(response.data);
        setUpdatedProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axiosInstance
      .put("/user/settings", updatedProfile)
      .then(() => {
        setProfile(updatedProfile);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div>
      <h2>Profile</h2>
      {isEditing ? (
        <div>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={updatedProfile.username}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={updatedProfile.email}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleEditToggle}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <button onClick={handleEditToggle}>Edit</button>
        </div>
      )}
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
