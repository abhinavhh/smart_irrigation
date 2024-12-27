import React, { useEffect, useState } from "react";
import axiosInstance from "../Services/Api";

function ControlPanel() {
  const [irrigationSettings, setIrrigationSettings] = useState([]);
  const [manualControl, setManualControl] = useState(false);

  useEffect(() => {
    // Fetch irrigation settings
    axiosInstance
      .get("/irrigation/settings")
      .then((response) => {
        setIrrigationSettings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching irrigation settings:", error);
      });
  }, []);

  const handleManualControl = () => {
    setManualControl(!manualControl);
    console.log(`Manual control ${manualControl ? "enabled" : "disabled"}`);
    // Update backend if needed
  };

  return (
    <div>
      <h2>Control Panel</h2>
      <button onClick={handleManualControl}>
        {manualControl ? "Disable" : "Enable"} Manual Control
      </button>
      <h3>Irrigation Timings</h3>
      <ul>
        {irrigationSettings.map((setting) => (
          <li key={setting.id}>
            Crop: {setting.crop.name} | Start: {setting.startTime} | End:{" "}
            {setting.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ControlPanel;
