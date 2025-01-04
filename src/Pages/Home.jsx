import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [sensorData, setSensorData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws/sensor-data');

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setSensorData(data);
        };

        // return () => socket.close();
    }, []);

    return (
        <div>
            <button onClick={() => navigate('/profile')} style={{ float: 'right' }}>Profile</button>
            <h1>Smart Irrigation Dashboard</h1>
            
            {/* Sensor Data Cards */}
            <div style={{ display: 'flex', gap: '20px' }}>
                {sensorData.map((data, index) => (
                    <div key={index} style={{ border: '1px solid black', padding: '10px' }}>
                        <h3>{data.sensorType}</h3>
                        <p>{data.value}</p>
                    </div>
                ))}
            </div>

            <button onClick={() => navigate('/control-panel')} style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
                Control Panel
            </button>
        </div>
    );
};

export default Home;
