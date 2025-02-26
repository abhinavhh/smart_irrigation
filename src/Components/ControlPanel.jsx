import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { FiThermometer, FiDroplet, FiCloud, FiClock, FiEdit3 } from 'react-icons/fi';
import { toast, Bounce } from 'react-toastify';

const ControlPanel = () => {
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [sensorData, setSensorData] = useState({
        soilMoisture: 'N/A',
        temperature: 'N/A',
        humidity: 'N/A',
    });
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [manualControl, setManualControl] = useState(false);
    const [irrigationStatus, setIrrigationStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditingTime, setIsEditingTime] = useState(false);

    /** ✅ Load Selected Crop from localStorage on Page Load */
    useEffect(() => {
        const savedCropJSON = localStorage.getItem('selectedCrop');
        if (savedCropJSON) {
            const savedCrop = JSON.parse(savedCropJSON);
            setSelectedCrop(savedCrop);
            setStartTime(savedCrop.startTime || '');
            setEndTime(savedCrop.endTime || '');
            fetchCropDetails(savedCrop.id); // Fetch the latest crop details from the database
        } else {
            alert('No crop selected. Please select a crop first.');
        }
    }, []);

    /** ✅ Fetch Crop Details from the Database */
    const fetchCropDetails = async (cropId) => {
        try {
            const response = await axiosInstance.get(`crops/${cropId}`);
            setSelectedCrop(response.data); // Update the selected crop with the latest details
            setStartTime(response.data.startTime || '');
            setEndTime(response.data.endTime || '');
        } catch (error) {
            console.error('Error fetching crop details:', error);
            alert('Failed to fetch crop details.');
        } finally {
            setLoading(false);
        }
    };

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
            alert("Error controlling valve: " + error.message);
        }
    };

    /** ✅ Trigger Automatic Irrigation Analysis */
    const analyzeIrrigation = async () => {
        try {
            if (!selectedCrop) {
                alert('No crop selected. Please select a crop first.');
                return;
            }

            // Prepare the payload with cropId
            const payload = {
                cropId: selectedCrop.id,
            };

            // Send the irrigation analysis request to the backend
            const response = await axiosInstance.post(`/irrigation/analyze/${selectedCrop.id}`, payload);

            // Display success message
            setIrrigationStatus(response.data.message || 'Analysis completed.');
        } catch (error) {
            alert('Error in irrigation analysis: ' + error.message);
        }
    };

    useEffect(() => {
        let socket;
        let intervalId;
    
        const openSocket = () => {
          socket = new WebSocket("ws://192.168.1.63:8080/ws/sensor-data");
    
          socket.onopen = () => {
            console.log("WebSocket connected!");
          };
    
          socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              console.log("Received sensor data:", data);
              setSensorData((prevData) => ({
                ...prevData,
                Temperature: data.Temperature || prevData.Temperature,
                Humidity: data.Humidity || prevData.Humidity,
                SoilMoisture: data.SoilMoisture || prevData.SoilMoisture,
              }));
            } catch (error) {
              console.error("Error parsing WebSocket message:", error);
            }
          };
    
          socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
          };
    
          socket.onclose = (event) => {
            console.log("WebSocket closed:", event);
          };
        };
    
        const closeSocket = () => {
          if (socket) {
            socket.close();
            console.log("WebSocket closed");
          }
        };
    
        const requestData = () => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send("Request data"); // Send a request for new data
            console.log("Requesting sensor data...");
          }
        };
    
        const manageSocket = () => {
          openSocket();
          requestData();
    
          intervalId = setInterval(() => {
            closeSocket();
            openSocket();
            requestData();
          }, 5000); // Fetch data every 5 seconds
        };
    
        manageSocket();
    
        return () => {
          clearInterval(intervalId);
          closeSocket();
        };
      }, []);

    /** ✅ Set Irrigation Time */
    const setIrrigationTime = async () => {
        try {
            if (!selectedCrop) {
                alert('No crop selected. Please select a crop first.');
                return;
            }

            // Send the irrigation time data to the backend
            const response = await axiosInstance.put(`crops/${selectedCrop.id}/set-irrigation-time`, {
                startTime,
                endTime,
            });

            // Update the selected crop with the new times
            const updatedCrop = { ...selectedCrop, startTime, endTime };
            setSelectedCrop(updatedCrop);
            localStorage.setItem('selectedCrop', JSON.stringify(updatedCrop));

            alert('Irrigation time set successfully.');
        } catch (error) {
            toast.warn('Error setting time', {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
                });
        }
    };

    /** ✅ Toggle Edit Mode for Irrigation Time */
    const toggleEditMode = () => {
        setIsEditingTime(!isEditingTime);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <p className="text-xl">Loading crop details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-gray-200 flex flex-col items-center py-10">
            <div className="w-full max-w-4xl bg-gray-800 shadow-lg rounded-lg p-6 space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-100 text-center">Control Panel</h2>

                {/* ✅ Display Selected Crop Information */}
                {selectedCrop ? (
                    <div className="bg-gray-700 p-5 rounded-lg">
                        <h3 className="text-xl font-semibold text-green-300 mb-3">
                            Selected Crop: <span className="text-white">{selectedCrop.name}</span>
                        </h3>
                        
                        <h4 className="text-lg font-semibold text-gray-100 mb-3">Crop Thresholds:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <p className="text-gray-400 text-sm">Temperature (°C)</p>
                                <p className="text-gray-100">Min: <span className="font-semibold">{selectedCrop.minTemperature}°C</span></p>
                                <p className="text-gray-100">Max: <span className="font-semibold">{selectedCrop.maxTemperature}°C</span></p>
                            </div>
                            
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <p className="text-gray-400 text-sm">Humidity (%)</p>
                                <p className="text-gray-100">Min: <span className="font-semibold">{selectedCrop.minHumidity}%</span></p>
                                <p className="text-gray-100">Max: <span className="font-semibold">{selectedCrop.maxHumidity}%</span></p>
                            </div>
                            
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <p className="text-gray-400 text-sm">Soil Moisture (%)</p>
                                <p className="text-gray-100">Min: <span className="font-semibold">{selectedCrop.minSoilMoisture}%</span></p>
                                <p className="text-gray-100">Max: <span className="font-semibold">{selectedCrop.maxSoilMoisture}%</span></p>
                            </div>
                        </div>

                        {/* ✅ Display Irrigation Time */}
                        {selectedCrop.startTime && selectedCrop.endTime ? (
                            <div className="mt-4 bg-gray-800 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-lg font-semibold text-gray-100 mb-2 flex items-center">
                                        <FiClock className="mr-2" /> Irrigation Time
                                    </h4>
                                    <button
                                        onClick={toggleEditMode}
                                        className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm"
                                    >
                                        <FiEdit3 className="mr-1" /> 
                                        {isEditingTime ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                {isEditingTime ? (
                                    <div className="mt-4">
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
                                        <button
                                            onClick={setIrrigationTime}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-100">Start: <span className="font-semibold">{selectedCrop.startTime}</span></p>
                                        <p className="text-gray-100">End: <span className="font-semibold">{selectedCrop.endTime}</span></p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-4 bg-gray-800 p-3 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-100 mb-2 flex items-center">
                                    <FiClock className="mr-2" /> Set Irrigation Time
                                </h4>
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
                                <button
                                    onClick={setIrrigationTime}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                                >
                                    Set Timing
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-gray-700 p-5 rounded-lg text-center">
                        <p className="text-yellow-400 font-semibold">No crop selected</p>
                        <p className="text-gray-300 mt-1">Please select a crop from the Select Crop page first</p>
                    </div>
                )}

                {/* ✅ Display Real-Time Sensor Data */}
                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-100 mb-4">Real-Time Sensor Data:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Soil Moisture */}
                        <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center">
                        <p className="text-gray-400 text-sm">Soil Moisture</p>
                        <p className="text-2xl font-bold text-blue-400">{sensorData.SoilMoisture}%</p>
                        {selectedCrop && (
                            <p className="text-xs text-gray-400 mt-1">
                            Target: {selectedCrop.minSoilMoisture}% - {selectedCrop.maxSoilMoisture}%
                            </p>
                        )}
                        </div>

                        {/* Temperature */}
                        <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center">
                        <p className="text-gray-400 text-sm">Temperature</p>
                        <p className="text-2xl font-bold text-red-400">{sensorData.Temperature}°C</p>
                        {selectedCrop && (
                            <p className="text-xs text-gray-400 mt-1">
                            Target: {selectedCrop.minTemperature}°C - {selectedCrop.maxTemperature}°C
                            </p>
                        )}
                        </div>

                        {/* Humidity */}
                        <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center">
                        <p className="text-gray-400 text-sm">Humidity</p>
                        <p className="text-2xl font-bold text-green-400">{sensorData.Humidity}%</p>
                        {selectedCrop && (
                            <p className="text-xs text-gray-400 mt-1">
                            Target: {selectedCrop.minHumidity}% - {selectedCrop.maxHumidity}%
                            </p>
                        )}
                        </div>
                    </div>
                    </div>

                {/* ✅ Control Buttons */}
                <div className="flex flex-wrap gap-4 justify-between">
                    <button
                        onClick={toggleManualControl}
                        className={`px-6 py-2 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 ${
                            manualControl ? 'bg-red-500 hover:scale-105' : 'bg-blue-500 hover:scale-105'
                        }`}
                        disabled={!selectedCrop}
                    >
                        {manualControl ? 'Close Valve' : 'Open Valve Manually'}
                    </button>
                    <button
                        onClick={analyzeIrrigation}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                        disabled={!selectedCrop}
                    >
                        Analyze Irrigation
                    </button>
                </div>

                {/* ✅ Analysis Result Display */}
                {irrigationStatus && (
                    <div className="mt-4 p-4 bg-gray-700 text-gray-100 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Irrigation Analysis Result:</h3>
                        <p className="bg-gray-800 p-3 rounded-lg">{irrigationStatus}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ControlPanel;