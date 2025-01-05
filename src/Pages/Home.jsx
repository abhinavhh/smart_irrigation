import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [sensorData, setSensorData] = useState({
        Temperature: "N/A",
        Humidity: "N/A",
        "Soil Moisture": "N/A"
    });
    const navigate = useNavigate();

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws/sensor-data");

        // Open WebSocket Connection
        socket.onopen = () => {
            console.log("WebSocket connected!");
        };

        // Receiving Real-Time Data
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setSensorData((prev) => ({
                    ...prev,
                    [data.sensorType]: data.value
                }));
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        // Handle Connection Errors
        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        // Properly Close WebSocket on Component Unmount
        return () => {
            socket.close();
            console.log("WebSocket closed");
        };
    }, []);

    return (
        <div>
            <button onClick={() => navigate('/profile')} style={{ float: 'right' }}>Profile</button>
            <h1>Smart Irrigation Dashboard</h1>
            
            {/* Sensor Data Cards */}
            <div style={{ display: 'flex', gap: '20px' }}>
                {Object.entries(sensorData).map(([key, value]) => (
                    <div key={key} style={{ border: '2px solid black', padding: '10px' }}>
                        <h3>{key}</h3>
                        <p>{value}</p>
                    </div>
                ))}
            </div>

            <button onClick={() => navigate('/addCrop')} style={{ marginTop: '20px' }}>Add Crop</button>
            <button onClick={() => navigate('/control-panel')} style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
                Control Panel
            </button>
        </div>
    );
};

export default Home;
