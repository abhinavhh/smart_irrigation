import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios";
import { toast, Slide } from "react-toastify";
import dayjs from "dayjs";
import { BellIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const lastNotificationTimeRef = useRef(0);
  const userId = localStorage.getItem("userId"); // Get logged-in user ID

  // Fetch Notifications from the backend
  useEffect(() => {
    if (!userId) return;
    axiosInstance
      .get(`/notifications?userId=${userId}`)
      .then((response) => setNotifications(response.data))
      .catch((error) => console.error("Error fetching notifications:", error));
  }, [userId]);

  // Check Sensor Data Against User-Specific Thresholds
  const checkSensorThresholds = async () => {
    if (!userId) {
      console.warn("User not logged in");
      return;
    }

    try {
      // Fetch the latest sensor data for the user
      const sensorResponse = await axiosInstance.get(
        `/sensor/latest`
      );
      const latestData = sensorResponse.data;

      // Fetch user-defined threshold settings
      const thresholdsResponse = await axiosInstance.get(
        `/usercrops/thresholds?userId=${userId}`
      );
      const thresholds = thresholdsResponse.data;

      const outOfRangeMessages = [];

      if (latestData.temperature !== undefined) {
        if (
          latestData.temperature < thresholds.minTemperature ||
          latestData.temperature > thresholds.maxTemperature
        ) {
          outOfRangeMessages.push(
            `Temperature ${latestData.temperature}°C is out of range (${thresholds.minTemperature}°C - ${thresholds.maxTemperature}°C).`
          );
        }
      }

      if (latestData.humidity !== undefined) {
        if (
          latestData.humidity < thresholds.minHumidity ||
          latestData.humidity > thresholds.maxHumidity
        ) {
          outOfRangeMessages.push(
            `Humidity ${latestData.humidity}% is out of range (${thresholds.minHumidity}% - ${thresholds.maxHumidity}%).`
          );
        }
      }

      if (latestData.soilMoisture !== undefined) {
        if (
          latestData.soilMoisture < thresholds.minSoilMoisture ||
          latestData.soilMoisture > thresholds.maxSoilMoisture
        ) {
          outOfRangeMessages.push(
            `Soil Moisture ${latestData.soilMoisture}% is out of range (${thresholds.minSoilMoisture}% - ${thresholds.maxSoilMoisture}%).`
          );
        }
      }

      // If out-of-range values are detected, send a notification
      if (outOfRangeMessages.length > 0) {
        const now = Date.now();
        if (now - lastNotificationTimeRef.current >= 1000) {
          const notificationMessage = outOfRangeMessages.join(" ");

          // Store notification in backend
          await axiosInstance.post("/notifications", {
            userId,
            message: notificationMessage,
          });

          // Update frontend state
          setNotifications((prev) => [
            ...prev,
            {
              id: Date.now(),
              message: notificationMessage,
              createdAt: new Date().toISOString(),
            },
          ]);

          // Show toast alert
          toast.info(notificationMessage, {
            position: "bottom-right",
            autoClose: 5000,
            transition: Slide,
          });

          lastNotificationTimeRef.current = now;
        }
      }
    } catch (error) {
      console.error("Error checking sensor thresholds:", error);
    }
  };

  // Run check every 30 minutes
  useEffect(() => {
    const intervalId = setInterval(checkSensorThresholds, 1000);
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
            {notifications.length} Alerts
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
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all duration-300"
                >
                  <div className="flex items-start">
                    <ExclamationCircleIcon className="w-6 h-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="text-gray-200">{notification.message}</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {dayjs(notification.createdAt).format(
                          "MM/DD/YYYY HH:mm:ss"
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Notification;
