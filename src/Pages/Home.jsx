import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Services/Api";

function Home({ onLogout }) {
  const [crops, setCrops] = useState(JSON.parse(localStorage.getItem("crops")) || []);
  const [sensorData, setSensorData] = useState(JSON.parse(localStorage.getItem("sensorData")) || {});
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/crops")
      .then((response) => {
        setCrops(response.data);
        localStorage.setItem("crops", JSON.stringify(response.data));
      })
      .catch((error) => console.error("Error fetching crops:", error));

    axiosInstance
      .get("/sensor/latest")
      .then((response) => {
        setSensorData(response.data);
        localStorage.setItem("sensorData", JSON.stringify(response.data));
      })
      .catch((error) => console.error("Error fetching sensor data:", error));
  }, []);

  const handleCropClick = (cropId) => {
    navigate(`/crop/${cropId}`);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Your Crops</h2>
      {crops.length === 0 ? (
        <div>
          <p>No crops added yet</p>
          <button onClick={() => navigate("/add-crop")}>Add Crop</button>
        </div>
      ) : (
        <ul>
          {crops.map((crop) => (
            <li
              key={crop.id}
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => handleCropClick(crop.id)}
            >
              {crop.name}
            </li>
          ))}
        </ul>
      )}
            <h2>Current Sensor Readings</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        {["temperature", "humidity", "soilMoisture"].map((type) => (
          <div
            key={type}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/graph/${type}`)}
          >
            <p>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
            <p>{sensorData[type] || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
    
  );
}

export default Home;
