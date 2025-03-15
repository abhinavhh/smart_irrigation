import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChartBarIcon, PlusCircleIcon, CogIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { WaterDropIcon, ThermometerIcon, LeafIcon } from "./CustomIcons";
import { toast, Slide } from "react-toastify";
const Home = () => {
  const [selectedCrops, setSelectedCrops] = useState([]); // Array of selected crops
  const [sensorData, setSensorData] = useState({
      Temperature: "N/A",
      Humidity: "N/A",
      SoilMoisture: "N/A",
  });
  const navigate = useNavigate();

  useEffect(() => {
      // Load selected crops from localStorage
      const savedCropsJSON = localStorage.getItem('selectedCrops');
      if (savedCropsJSON) {
          const savedCrops = JSON.parse(savedCropsJSON);
          setSelectedCrops(savedCrops);
      }
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-6 font-sans mt-10">
          <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-10">
                  <h1 className="text-4xl font-bold text-teal-400">Smart Irrigation Dashboard</h1>
              </div>

              {/* Sensor Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  {Object.entries(sensorData).map(([key, value]) => (
                      <div
                          key={key}
                          className="bg-gray-800 shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
                          onClick={() => navigate(`/graph/${key}`)}
                      >
                          <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-semibold text-teal-400">{key}</h3>
                          </div>
                          <div className="text-4xl font-bold text-gray-300">{value}{key === "Temperature" ? "°C" : key === "Humidity" ? "%" : "%"}</div>
                      </div>
                  ))}
              </div>

              {/* Selected Crops */}
              {selectedCrops.length > 0 && (
                  <div className="bg-gray-700 p-5 rounded-lg mb-5">
                      <h3 className="text-xl font-semibold text-green-300">Selected Crops</h3>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {selectedCrops.map((crop) => (
                              <div key={crop.id} className="bg-gray-800 p-4 rounded-lg">
                                  <h4 className="text-lg font-semibold text-green-300">{crop.name}</h4>
                                  <div className="mt-2">
                                      <p className="text-gray-400 font-bold">Temperature: {crop.minTemperature}°C - {crop.maxTemperature}°C</p>
                                      <p className="text-gray-400 font-bold">Humidity: {crop.minHumidity}% - {crop.maxHumidity}%</p>
                                      <p className="text-gray-400 font-bold">Soil Moisture: {crop.minSoilMoisture}% - {crop.maxSoilMoisture}%</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );
};

export default Home;