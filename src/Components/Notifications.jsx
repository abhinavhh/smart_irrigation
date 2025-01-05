import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications
    axiosInstance
      .get("/notifications")
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message} - {new Date(notification.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notification;
