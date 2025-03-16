import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios";
import { toast, Slide } from "react-toastify";
import dayjs from "dayjs";
import { BellIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  // Use a ref to store the timestamp of the last notification check
  const lastNotificationTimeRef = useRef(0);

  // Fetch notifications from backend on mount
  useEffect(() => {
    axiosInstance
      .get("/notifications")
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, []);

  // Function to check sensor thresholds and create notifications if needed
  const checkSensorThresholds = async () => {
    try {
      // Retrieve the current user's ID and the selected crop mapping from localStorage
      const userId = localStorage.getItem("userId");
      const savedMappingJSON = localStorage.getItem("selectedCrop");
      if (!userId || !savedMappingJSON) {
        console.warn("User or selected crop not available");
        return;
      }
      const selectedMapping = JSON.parse(savedMappingJSON);
      // Retrieve threshold values from the selected crop mapping
      const {
        customMinTemperature,
        customMaxTemperature,
        customMinHumidity,
        customMaxHumidity,
        customMinSoilMoisture,
        customMaxSoilMoisture,
      } = selectedMapping;
      
      // Fetch the latest sensor data for the user
      const sensorResponse = await axiosInstance.get(
        `/sensor/latest?userId=${userId}`
      );
      const latestData = sensorResponse.data;
      // For each sensor type, compare the value to thresholds
      const outOfRangeMessages = [];
      if (latestData.sensorType === "Temperature") {
        const temp = latestData.value;
        if (temp < customMinTemperature || temp > customMaxTemperature) {
          outOfRangeMessages.push(`Temperature ${temp}°C is out of range (${customMinTemperature}°C - ${customMaxTemperature}°C).`);
        }
      } else if (latestData.sensorType === "Humidity") {
        const hum = latestData.value;
        if (hum < customMinHumidity || hum > customMaxHumidity) {
          outOfRangeMessages.push(`Humidity ${hum}% is out of range (${customMinHumidity}% - ${customMaxHumidity}%).`);
        }
      } else if (latestData.sensorType === "SoilMoisture") {
        const soil = latestData.value;
        if (soil < customMinSoilMoisture || soil > customMaxSoilMoisture) {
          outOfRangeMessages.push(`Soil Moisture ${soil}% is out of range (${customMinSoilMoisture}% - ${customMaxSoilMoisture}%).`);
        }
      }
      // If any out-of-range messages are found, create a notification.
      if (outOfRangeMessages.length > 0) {
        // To avoid duplicate notifications within 30 minutes, check lastNotificationTimeRef
        const now = Date.now();
        if (now - lastNotificationTimeRef.current >= 60000) {
          const notificationMessage = outOfRangeMessages.join(" ");
          // Optionally, post to your backend notifications endpoint:
          await axiosInstance.post("/notifications", { message: notificationMessage });
          // Update local state by fetching notifications again or appending:
          setNotifications((prev) => [
            ...prev,
            {
              id: Date.now(), // temporary id
              message: notificationMessage,
              createdAt: new Date().toISOString(),
            },
          ]);
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

  // Set an interval to check thresholds every 30 minutes
  useEffect(() => {
    const intervalId = setInterval(checkSensorThresholds, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 pt-20 pb-6 px-6 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-teal-400 flex items-center">
            <BellIcon className="w-8 h-8 mr-3" />
            Notifications
          </h1>
          <motion.span
            className="text-teal-400 bg-gray-800 px-4 py-1 rounded-full shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            {notifications.length} Alerts
          </motion.span>
        </motion.div>

        {/* Notification Panel */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="w-16 h-16 text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
              <p className="text-gray-400 text-lg">No notifications yet</p>
            </div>
          ) : (
            <motion.ul
              variants={containerVariants}
              className="space-y-3 max-h-96 overflow-y-auto"
            >
              {notifications.map((notification, index) => (
                <motion.li
                  key={notification.id ? `${notification.id}-${index}` : index}
                  variants={itemVariants}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all duration-300"
                >
                  <div className="flex items-start">
                    <ExclamationCircleIcon className="w-6 h-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="text-gray-200">{notification.message}</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {dayjs(notification.createdAt).isValid()
                          ? dayjs(notification.createdAt).format("MM/DD/YYYY HH:mm:ss")
                          : "No Date"}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        {/* Control Panel */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-teal-400 mb-4">Notification Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-teal-300 mb-3">Alert Frequency</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Check interval:</span>
                <span className="text-teal-400 font-medium">1 minutes</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-teal-300 mb-3">Notification Types</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="temp-alerts"
                    checked={true}
                    onChange={() => {}}
                    className="w-4 h-4 text-teal-500 bg-gray-800 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="temp-alerts" className="ml-2 text-gray-300">
                    Temperature Alerts
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="humidity-alerts"
                    checked={true}
                    onChange={() => {}}
                    className="w-4 h-4 text-teal-500 bg-gray-800 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="humidity-alerts" className="ml-2 text-gray-300">
                    Humidity Alerts
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="soil-alerts"
                    checked={true}
                    onChange={() => {}}
                    className="w-4 h-4 text-teal-500 bg-gray-800 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="soil-alerts" className="ml-2 text-gray-300">
                    Soil Moisture Alerts
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-500 transition-all duration-300">
              Save Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Notification;