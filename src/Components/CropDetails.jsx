import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";

function CropDetails() {
  const { cropId } = useParams();
  const [crop, setCrop] = useState(null);

  useEffect(() => {
    // Fetch crop details by ID
    axiosInstance
      .get(`/crops/${cropId}`)
      .then((response) => {
        setCrop(response.data);
      })
      .catch((error) => console.error("Error fetching crop details:", error));
  }, [cropId]);

  if (!crop) {
    return <p>Loading crop details...</p>;
  }

  return (
    <div>
      <h1>{crop.name}</h1>
      <img
        src={crop.imageUrl}
        alt={crop.name}
        style={{ width: "300px", height: "200px" }}
      />
      <p>{crop.description}</p>
      <h3>Ideal Conditions:</h3>
      <p>Min Temperature: {crop.minTemperature}°C</p>
      <p>Max Temperature: {crop.maxTemperature}°C</p>
      <p>Min Humidity: {crop.minHumidity}%</p>
      <p>Max Humidity: {crop.maxHumidity}%</p>
      <p>Min Soil Moisture: {crop.minSoilMoisture}%</p>
      <p>Max Soil Moisture: {crop.maxSoilMoisture}%</p>
    </div>
  );
}

export default CropDetails;
