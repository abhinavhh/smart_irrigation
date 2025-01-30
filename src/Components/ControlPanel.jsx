import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const ControlPanel = () => {
    const [crops, setCrops] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState('');
    const [cropDetails, setCropDetails] = useState(null);
    const [sensorData, setSensorData] = useState({
        soilMoisture: 'N/A',
        temperature: 'N/A',
        humidity: 'N/A',
    });
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [manualControl, setManualControl] = useState(false);
    const [irrigationStatus, setIrrigationStatus] = useState('');

    /** ✅ Fetch Crop List on Page Load */
    useEffect(() => {
        axiosInstance.get('/crops/all')
            .then(response => setCrops(response.data))
            .catch(error => console.error("Error fetching crops:", error));
    }, []);

    /** ✅ Fetch Crop Details when a Crop is Selected */
    useEffect(() => {
        if (selectedCrop) {
            const crop = crops.find(c => c.id === parseInt(selectedCrop));
            setCropDetails(crop || null);
        }
    }, [selectedCrop, crops]);

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
            if (!selectedCrop) {
                alert('Please select a crop.');
                return;
            }
            if (!startTime || !endTime) {
                alert('Please set a start and end time for irrigation.');
                return;
            }

            // Prepare the payload with cropId and irrigation times
            const payload = {
                cropId: selectedCrop,
                startTime,
                endTime,
            };

            // Send the irrigation time data to the backend
            const response = await axiosInstance.post(`/irrigation/analyze/${selectedCrop}`, payload);
            
            // Assuming the backend returns a detailed message about irrigation status
            setIrrigationStatus(response.data.message || 'Analysis completed.');
        } catch (error) {
            console.error('Error in irrigation analysis:', error);
            alert('Error in irrigation analysis.');
        }
    };

    /** ✅ Fetch Irrigation Status */
    const fetchIrrigationStatus = async () => {
        try {
            const response = await axiosInstance.get('/irrigation/status');
            setIrrigationStatus(response.data);
        } catch (error) {
            alert('Error fetching irrigation status.', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-gray-200 flex flex-col items-center py-10">
            <div className="w-full max-w-4xl bg-gray-800 shadow-lg rounded-lg p-6 space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-100 text-center">Control Panel</h2>

                {/* ✅ Crop Selection Dropdown */}
                <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-2">Select Crop:</label>
                    <select
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring-blue-500"
                    >
                        <option value="">Select a Crop</option>
                        {crops.map((crop) => (
                            <option key={crop.id} value={crop.id}>{crop.name}</option>
                        ))}
                    </select>
                </div>

                {/* ✅ Display Selected Crop Thresholds */}
                {cropDetails && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-100 mb-4">Crop Thresholds:</h3>
                        <p className="text-green-100">Min Temperature: <span className="font-semibold">{cropDetails.minTemperature}°C</span></p>
                        <p className="text-gray-100">Max Temperature: <span className="font-semibold">{cropDetails.maxTemperature}°C</span></p>
                        <p className="text-gray-100">Min Humidity: <span className="font-semibold">{cropDetails.minHumidity}%</span></p>
                        <p className="text-gray-100">Max Humidity: <span className="font-semibold">{cropDetails.maxHumidity}%</span></p>
                        <p className="text-gray-100">Min Soil Moisture: <span className="font-semibold">{cropDetails.minSoilMoisture}%</span></p>
                        <p className="text-gray-100">Max Soil Moisture: <span className="font-semibold">{cropDetails.maxSoilMoisture}%</span></p>
                    </div>
                )}

                {/* ✅ Set Irrigation Time Window */}
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-100 mb-4">Set Irrigation Time Window:</h3>
                    <div className="flex space-x-4">
                        <div>
                            <label className="block text-gray-100 font-semibold mb-2">Start Time:</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="px-4 py-2 border border-gray-950 rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-100 font-semibold mb-2">End Time:</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="px-4 py-2 border border-gray-950 text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                </div>

                {/* ✅ Display Real-Time Sensor Data */}
                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-100 mb-4">Real-Time Sensor Data:</h3>
                    <p className="text-gray-100">Soil Moisture: <span className="font-semibold">{sensorData.soilMoisture}%</span></p>
                    <p className="text-gray-100">Temperature: <span className="font-semibold">{sensorData.temperature}°C</span></p>
                    <p className="text-gray-100">Humidity: <span className="font-semibold">{sensorData.humidity}%</span></p>
                </div>

                {/* ✅ Control Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={toggleManualControl}
                        className={`px-6 py-2 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 ${
                            manualControl ? 'bg-red-500 hover:scale-105' : 'bg-blue-500 hover:scale-105'
                        }`}
                    >
                        {manualControl ? 'Close Valve' : 'Open Valve Manually'}
                    </button>
                    <button
                        onClick={analyzeIrrigation}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                    >
                        Analyze Irrigation
                    </button>
                    <button
                        onClick={fetchIrrigationStatus}
                        className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                    >
                        Check Irrigation Status
                    </button>
                </div>

                {/* ✅ Analysis Result Display */}
                {irrigationStatus && (
                    <div className="mt-4 p-4 bg-gray-700 text-gray-100 rounded-lg">
                        <h3 className="text-lg font-semibold">Irrigation Analysis Result:</h3>
                        <p>{irrigationStatus}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ControlPanel;
