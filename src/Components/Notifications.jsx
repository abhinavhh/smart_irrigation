import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios";
import { toast, Slide } from "react-toastify";
import dayjs from "dayjs";
import { BellIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function NotificationComponent() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastNotificationTimeRef = useRef(0);
  const userId = localStorage.getItem("userId"); // Get logged-in user ID

  // Fetch existing notifications from the backend on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        console.warn("User not logged in");
        return;
      }
      try {
        const response = await axiosInstance.get(`/notifications?userId=${userId}`);
        setNotifications(response.data);
        // Count unread notifications
        const unread = response.data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      }
    };

    fetchNotifications();
  }, [userId]);

  // Function to mark a notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`, { userId });
      
      // Update local state
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      );
      
      setNotifications(updatedNotifications);
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Check for new notifications periodically
  const checkUserNotification = async () => {
    if (!userId) return;

    try {
      const response = await axiosInstance.post(
        `/notifications/check?userId=${userId}`
      );

      if (response.data && response.data.length > 0) {
        const latestNotification = response.data[0];
        const latestTime = new Date(latestNotification.createdAt).getTime();

        // Update notifications and show toast for new notifications
        if (latestTime > lastNotificationTimeRef.current) {
          setNotifications(response.data);
          
          // Count unread notifications
          const unread = response.data.filter((n) => !n.read).length;
          setUnreadCount(unread);

          toast.info(latestNotification.message, {
            position: "bottom-right",
            autoClose: 3000,
            transition: Slide,
          });

          lastNotificationTimeRef.current = latestTime;
        }
      }
    } catch (error) {
      console.error("Error checking user notification:", error);
    }
  };

  // Run notification check every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(checkUserNotification, 10000);
    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 pt-20 pb-6 px-6 font-sans">
      <motion.div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400 flex items-center">
            <BellIcon className="w-8 h-8 mr-3" />
            Notifications
          </h1>
          <span className="text-teal-400 bg-gray-800 px-4 py-1 rounded-full shadow-md">
            {unreadCount} Unread Alerts
          </span>
        </div>

        {/* Notification Panel */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-400 text-lg">No notifications yet</p>
            </div>
          ) : (
            <ul className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`rounded-lg p-4 transition-all duration-300 ${
                    notification.read 
                      ? "bg-gray-700 hover:bg-gray-600" 
                      : "bg-teal-900/30 hover:bg-teal-900/50"
                  }`}
                  onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                >
                  <p className={`${notification.read ? 'text-gray-400' : 'text-gray-200 font-semibold'}`}>
                    {notification.message}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {dayjs(notification.createdAt).format("MM/DD/YYYY HH:mm:ss")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default NotificationComponent;