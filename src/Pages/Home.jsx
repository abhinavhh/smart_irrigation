import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChartBarIcon, PlusCircleIcon, CogIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { WaterDropIcon, ThermometerIcon, LeafIcon } from "./CustomIcons";

const Home = () => {
  const [sensorData, setSensorData] = useState({
    Temperature: "N/A",
    Humidity: "N/A",
    SoilMoisture: "N/A",
  });
  const navigate = useNavigate();
  const [userCrops, setUserCrops] = useState([]); // Added for crops

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws/sensor-data");

    socket.onopen = () => {
      console.log("WebSocket connected!");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData((prev) => ({
          ...prev,
          [data.sensorType]: data.value,
        }));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };


    return () => {
      socket.close();
      console.log("WebSocket closed");
    };
  }, []);

  useEffect(() => {
    // Fetch user crops (simulating API call)
    const fetchCrops = async () => {
      const crops = await fetch("/api/user/crops").then((res) => res.json());
      setUserCrops(crops);
    };

    fetchCrops();
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-indigo-100 p-6 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-4xl font-bold text-green-800">
            Smart Irrigation Dashboard
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="bg-black text-green-500 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <UserCircleIcon className="w-5 h-5" />
            <span className="text-white">Profile</span>
          </motion.button>
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
              className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => navigate(`/graph/${key}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{key}</h3>
                {key === "Temperature" ? (
                  <ThermometerIcon className="w-8 h-8 text-red-500" />
                ) : key === "Humidity" ? (
                  <WaterDropIcon className="w-8 h-8 text-blue-500" />
                ) : (
                  <LeafIcon className="w-8 h-8 text-green-500" />
                )}
              </div>
              <div className="text-4xl font-bold text-gray-700">{value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* User Crops */}
        {userCrops.length === 0 ? (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/addCrop")}
            className="bg-teal-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-teal-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Add Crop</span>
          </motion.button>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userCrops.map((crop) => (
              <motion.div
                key={crop.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/crop-details/${crop.id}`)}
                className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800">{crop.name}</h3>
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-40 object-cover rounded-xl mt-4"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <motion.div
          variants={containerVariants}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/multi-sensor-graph")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2 mt-5"
          >
            <ChartBarIcon className="w-5 h-5" />
            <span>View Sensor Graph</span>
          </motion.button>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/control-panel")}
          className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2 fixed bottom-8 right-8"
        >
          <CogIcon className="w-5 h-5" />
          <span>Control Panel</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;
