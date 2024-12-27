import React, { useEffect, useState } from "react";
import axiosInstance from "../Services/Api";

function Dashboard() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/crops/all")
      .then((response) => {
        setCrops(response.data);
      })
      .catch((error) => {
        console.error("Error fetching crops:", error);
      });
  }, []);

  return (
    <div>
      <h2>Your Crops</h2>
      <ul>
        {crops.map((crop) => (
          <li key={crop.id}>{crop.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
