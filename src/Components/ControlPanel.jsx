import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const ControlPanel = () => {
    const [crops, setCrops] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState('');
    const [sensorData, setSensorData] = useState({
        soilMoisture: 'N/A',
        temperature: 'N/A',
        humidity: 'N/A'
    });
    const [manualControl, setManualControl] = useState(false);
    const [irrigationStatus, setIrrigationStatus] = useState('');

    /** ✅ Fetch Crop List on Page Load */
    useEffect(() => {
        axiosInstance.get('/crops/all')
            .then(response => setCrops(response.data))
            .catch(error => console.error("Error fetching crops:", error));
    }, []);

    /** ✅ Real-Time WebSocket Sensor Data Handling */
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws/sensor-data');
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setSensorData(data);
        };
        return () => socket.close();
    }, []);

    /** ✅ Handle Manual Valve Control */
    const toggleManualControl = async () => {
        try {
            await axiosInstance.post(`/irrigation/manual-control?openValve=${!manualControl}`);
            setManualControl(!manualControl);
        } catch (error) {
            console.error("Error controlling valve:", error);
        }
    };

    /** ✅ Trigger Automatic Irrigation Analysis */
    const analyzeIrrigation = async () => {
        try {
            await axiosInstance.post(`/irrigation/analyze/${selectedCrop}`);
            alert('Irrigation analysis completed successfully!');
        } catch (error) {
            alert('Error in irrigation analysis.');
        }
    };

    /** ✅ Fetch Irrigation Status */
    const fetchIrrigationStatus = async () => {
        try {
            const response = await axiosInstance.get('/irrigation/status');
            setIrrigationStatus(response.data);
        } catch (error) {
            alert('Error fetching irrigation status.');
        }
    };

    return (
        <div>
            <h2>Control Panel</h2>

            {/* ✅ Crop Selection Dropdown */}
            <label>Select Crop: </label>
            <select onChange={(e) => setSelectedCrop(e.target.value)}>
                <option value="">Select a Crop</option>
                {crops.map((crop) => (
                    <option key={crop.id} value={crop.id}>{crop.name}</option>
                ))}
            </select>

            {/* ✅ Display Real-Time Sensor Data */}
            <div>
                <h3>Real-Time Sensor Data:</h3>
                <p>Soil Moisture: {sensorData.soilMoisture}</p>
                <p>Temperature: {sensorData.temperature}</p>
                <p>Humidity: {sensorData.humidity}</p>
            </div>

            {/* ✅ Manual Control Button */}
            <button onClick={toggleManualControl}>
                {manualControl ? 'Close Valve' : 'Open Valve Manually'}
            </button>

            {/* ✅ Analyze Irrigation Button */}
            <button onClick={analyzeIrrigation}>Analyze Irrigation</button>

            {/* ✅ Fetch Status Button */}
            <button onClick={fetchIrrigationStatus}>Check Irrigation Status</button>
            <p>Status: {irrigationStatus}</p>
        </div>
    );
};

export default ControlPanel;
