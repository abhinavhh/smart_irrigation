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
        <div className="flex justify-center items-center h-screen">
            <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded shadow-md">
                <h2 className="text-lg font-bold mb-4 text-center">Control Panel</h2>

                {/* ✅ Crop Selection Dropdown */}
                <label className="block text-gray-700 text-sm font-bold mb-2">Select Crop: </label>
                <select onChange={(e) => setSelectedCrop(e.target.value)}
                    className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <option value="">Select a Crop</option>
                    {crops.map((crop) => (
                        <option key={crop.id} value={crop.id}>{crop.name}</option>
                    ))}
                </select>

                {/* ✅ Display Real-Time Sensor Data */}
                <div className="flex flex-col gap-2 m-4">
                    <h3 className="text-gray-700 text-sm font-bold mb-2 ">Real-Time Sensor Data:</h3>
                    <p className="text-gray-700 text-sm">Soil Moisture: {sensorData.soilMoisture}</p>
                    <p className="text-gray-700 text-sm">Temperature: {sensorData.temperature}</p>
                    <p className="text-gray-700 text-sm">Humidity: {sensorData.humidity}</p>
                </div>

                {/* ✅ Manual Control Button */}
                <button
                    onClick={toggleManualControl}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    manualControl ? "bg-red-500 hover:bg-red-700" : ""
                    }`}>
                    {manualControl ? 'Close Valve' : 'Open Valve Manually'}
                </button>

                {/* ✅ Analyze Irrigation Button */}
                <button onClick={analyzeIrrigation}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4">
                    Analyze Irrigation</button>

                {/* ✅ Fetch Status Button */}
                <button onClick={fetchIrrigationStatus}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                    Check Irrigation Status</button>
                <p>Status: {irrigationStatus}</p>
            </div>
        </div>
    );
};

export default ControlPanel;
