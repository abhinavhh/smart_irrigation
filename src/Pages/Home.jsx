import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CogIcon, PencilIcon } from "@heroicons/react/24/outline";
import { toast, Slide } from "react-toastify";
import axiosInstance from "../api/axios";

const Home = () => {
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [sensorData, setSensorData] = useState({
    Temperature: "N/A",
    Humidity: "N/A",
    SoilMoisture: "N/A",
  });
  const navigate = useNavigate();

  // Fetch user-specific crop mappings from the backend
  useEffect(() => {
    const fetchUserCrops = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }
        console.log("Fetching selected crops for userId:", userId);
        const response = await axiosInstance.get(`/usercrops/user/${userId}`);
        console.log("User crops response:", response.data);
        setSelectedCrops(response.data);
      } catch (error) {
        console.error("Error fetching user crops:", error);
        toast.error("Failed to fetch user crops", {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
          transition: Slide,
        });
      }
    };

    fetchUserCrops();
  }, []);

  // WebSocket setup for real-time sensor data
  useEffect(() => {
    let socket;
    let intervalId;

    const openSocket = () => {
      socket = new WebSocket("ws://192.168.1.40:8080/ws/sensor-data");

      socket.onopen = () => {
        console.log("WebSocket connected!");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received sensor data:", data);
          setSensorData((prevData) => ({
            ...prevData,
            Temperature: data.Temperature || prevData.Temperature,
            Humidity: data.Humidity || prevData.Humidity,
            SoilMoisture: data.SoilMoisture || prevData.SoilMoisture,
            WaterFlow: data.WaterFlow || prevData.WaterFlow,
          }));
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed:", event);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    const closeSocket = () => {
      if (socket) {
        socket.close();
        console.log("WebSocket closed");
      }
    };

    const requestData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("Request data");
        console.log("Requesting sensor data...");
      }
    };

    const manageSocket = () => {
      openSocket();
      setTimeout(requestData, 1000);
      intervalId = setInterval(() => {
        closeSocket();
        openSocket();
        setTimeout(requestData, 1000);
      }, 5000);
    };

    manageSocket();

    return () => {
      clearInterval(intervalId);
      closeSocket();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Navigate to crop-specific control panel
  const navigateToCropControl = (cropMappingId) => {
    // Optionally, store the selected mapping details if needed
    const cropMapping = selectedCrops.find((mapping) => mapping.id === cropMappingId);
    if (cropMapping) {
      localStorage.setItem("selectedCrop", JSON.stringify(cropMapping));
      navigate(`/control-panel/${cropMapping.crop.id}`);
    }
  };
  const handleEditCrops = () => {
    navigate("/addCrop");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 pt-12 pb-6 px-6 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-10 m-auto">
          <h1 className="text-4xl font-bold text-teal-400">Dashboard</h1>
        </motion.div>

        {/* Sensor Data */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10"
        >
          {Object.entries(sensorData).map(([key, value]) => (
            <motion.div
              key={key}
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/graph/${key}`)}
              className="relative group bg-gray-800 shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-teal-400">{key}</h3>
              </div>
              <div className="text-4xl font-bold text-gray-300">
                {value}
                {key === "Temperature" ? "°C" : key === "Humidity" ? "%" : "%"}
              </div>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-gray-800 text-teal-400 text-sm py-2 px-4 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to View Graph Page
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* User Crops with Individual Control Panel Buttons and edit buttons*/}
        {selectedCrops.length > 0 ? (
          <div className="bg-gray-700 p-5 rounded-lg mb-5">
            <h3 className="text-xl font-semibold text-green-300">Selected Crops</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center">
              {selectedCrops.map((mapping) => (
                <motion.div
                  key={mapping.id}
                  variants={itemVariants}
                  className="bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex justify-between">
                    <h4 className="text-lg font-semibold text-green-300">{mapping.crop.name}</h4>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEditCrops}
                      className="bg-gray-800 text-teal-400 p-2 rounded-full shadow-md hover:bg-gray-600 transition-all duration-300 flex items-center justify-center"
                      aria-label="Edit Crops"
                    >
                      <PencilIcon className="w-5 h-5" />
                      <span className="sr-only">Edit</span>
                      <div className="absolute right-0 top-10 mt-2 w-20 bg-gray-800 text-teal-400 text-xs py-1 px-2 rounded-md shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
                        Edit Crops
                      </div>
                    </motion.button>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-400 font-bold">
                      Temperature: {mapping.customMinTemperature}°C - {mapping.customMaxTemperature}°C
                    </p>
                    <p className="text-gray-400 font-bold">
                      Humidity: {mapping.customMinHumidity}% - {mapping.customMaxHumidity}%
                    </p>
                    <p className="text-gray-400 font-bold">
                      Soil Moisture: {mapping.customMinSoilMoisture}% - {mapping.customMaxSoilMoisture}%
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateToCropControl(mapping.id)}
                    className="mt-4 w-full flex items-center justify-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-500 transition-all"
                  >
                    <CogIcon className="w-5 h-5" />
                    <span>Control Panel</span>
                  </motion.button>
                </motion.div>
              ))}
            </div>

          </div>
        ) : (
          <div className="text-center text-gray-400">No crops selected yet.</div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;
