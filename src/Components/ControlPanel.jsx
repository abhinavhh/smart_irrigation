import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { FiThermometer, FiDroplet, FiCloud, FiClock, FiEdit3 } from 'react-icons/fi';
import { toast, Bounce, Slide } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ControlPanel = () => {
    const { cropId } = useParams();
    const [selectedMapping, setSelectedMapping] = useState(null); // user crop mapping object
    const [sensorData, setSensorData] = useState({
        SoilMoisture: 'N/A',
        Temperature: 'N/A',
        Humidity: 'N/A',
    });
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [manualControl, setManualControl] = useState(false);
    const [irrigationStatus, setIrrigationStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditingTime, setIsEditingTime] = useState(false);

    // First, try to load the selected crop mapping from localStorage
    useEffect(() => {
        const savedMappingJSON = localStorage.getItem('selectedCrop');
        if (savedMappingJSON) {
            const savedMapping = JSON.parse(savedMappingJSON);
            console.log("Saved mapping from localStorage:", savedMapping);
            // Use optional chaining for safety
            if (savedMapping?.crop?.id?.toString() === cropId?.toString()) {
                setSelectedMapping(savedMapping);
                setStartTime(savedMapping.customIrrigationStartTime || '');
                setEndTime(savedMapping.customIrrigationEndTime || '');
                setLoading(false);
                return;
            }
        }
        // Fallback: fetch mapping from backend
        const fetchMapping = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                toast.warn('User not logged in. Please log in again.', {
                    position: "bottom-right",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce,
                });
                setLoading(false);
                return;
            }
            try {
                const response = await axiosInstance.get(`/usercrops/user/${userId}`);
                console.log("Fetched mappings from backend:", response.data);
                // Filter for the mapping matching the cropId
                const mapping = response.data.find(
                    (m) => m?.crop?.id?.toString() === cropId?.toString()
                );
                if (mapping) {
                    setSelectedMapping(mapping);
                    setStartTime(mapping.customIrrigationStartTime || '');
                    setEndTime(mapping.customIrrigationEndTime || '');
                    localStorage.setItem('selectedCrop', JSON.stringify(mapping));
                } else {
                    toast.warn('No mapping found for this crop. Please select it from the Select Crop page.', {
                        position: "bottom-right",
                        autoClose: 3000,
                        theme: "dark",
                        transition: Bounce,
                    });
                }
            } catch (error) {
                console.error('Error fetching user crop mapping:', error);
                toast.error('Failed to fetch crop details.', {
                    position: "bottom-right",
                    theme: "dark",
                    transition: Bounce,
                });
            } finally {
                setLoading(false);
            }
        };
    
        fetchMapping();
    }, [cropId]);

    /** WebSocket Sensor Data Handling */
    useEffect(() => {
        let socket;
        let intervalId;

        const openSocket = () => {
            socket = new WebSocket("ws://192.168.1.40:8080/ws/sensor-data");

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
                socket.send("Request data");
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
            }, 5000);
        };

        manageSocket();

        return () => {
            clearInterval(intervalId);
            closeSocket();
        };
    }, []);

    /** Handle Manual Valve Control */
    const toggleManualControl = async () => {
        try {
            await axiosInstance.post(`/irrigation/manual-control?openValve=${!manualControl}`);
            setManualControl(!manualControl);
        } catch (error) {
            toast.error("Error controlling valve: " + error.message, {
                position: "bottom-right",
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    /** Trigger Automatic Irrigation Analysis */
    const analyzeIrrigation = async () => {
        try {
            if (!selectedMapping) {
                toast.warn('No crop selected. Please select a crop first.', {
                    position: "bottom-right",
                    theme: "dark",
                    transition: Bounce,
                });
                return;
            }
            const payload = {
                cropId: selectedMapping.crop.id,
            };
            const response = await axiosInstance.post(`/irrigation/analyze/${selectedMapping.crop.id}`, payload);
            setIrrigationStatus(response.data);
        } catch (error) {
            toast.error('Error in irrigation analysis: ' + error.message, {
                position: "bottom-right",
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    /** Set Irrigation Time for the User Crop Mapping */
    const setIrrigationTime = async () => {
        try {
            if (!selectedMapping) {
                toast.warn('No crop selected. Please select a crop first.', {
                    position: "bottom-right",
                    theme: "dark",
                    transition: Bounce,
                });
                return;
            }

            if (!startTime || !endTime) {
                toast.warn('Both start and end times are required.', {
                    position: "bottom-right",
                    theme: "dark",
                    transition: Bounce,
                });
                return;
            }

            // Update user-specific irrigation times via the mapping update endpoint
            await axiosInstance.put(`/usercrops/update/${selectedMapping.id}`, {
                customIrrigationStartTime: startTime,
                customIrrigationEndTime: endTime,
            });

            // Update the local mapping state with new times
            const updatedMapping = {
                ...selectedMapping,
                customIrrigationStartTime: startTime,
                customIrrigationEndTime: endTime,
            };
            setSelectedMapping(updatedMapping);
            localStorage.setItem('selectedCrop', JSON.stringify(updatedMapping));

            setIsEditingTime(false);
            toast.success('Irrigation time set successfully.', {
                position: "bottom-right",
                autoClose: 1500,
                theme: "dark",
                transition: Slide,
            });
        } catch (error) {
            toast.error('Error setting time: ' + (error.response?.data || error.message), {
                position: "bottom-right",
                autoClose: 1500,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    /** Toggle Edit Mode for Irrigation Time */
    const toggleEditMode = () => {
        setIsEditingTime(!isEditingTime);
    };

    /** Cancel Editing */
    const cancelEditing = () => {
        // Reset to original values from the mapping
        setStartTime(selectedMapping?.customIrrigationStartTime || '');
        setEndTime(selectedMapping?.customIrrigationEndTime || '');
        setIsEditingTime(false);
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

                {/* Display Selected Crop Information */}
                {selectedMapping ? (
                    <div className="bg-gray-700 p-5 rounded-lg">
                        {/* Irrigation Time Display/Edit Section */}
                        <div className="mt-4 bg-gray-800 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-100 mb-2 flex items-center">
                                    <FiClock className="mr-2" /> Irrigation Time
                                </h4>
                                {selectedMapping.customIrrigationStartTime && selectedMapping.customIrrigationEndTime && !isEditingTime && (
                                    <button
                                        onClick={toggleEditMode}
                                        className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm"
                                    >
                                        <FiEdit3 className="mr-1" /> Edit
                                    </button>
                                )}
                            </div>
                            
                            {isEditingTime ? (
                                <div className="mt-4">
                                    <div className="flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
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
                                    <div className="flex space-x-3 mt-4">
                                        <button
                                            onClick={setIrrigationTime}
                                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-500 transition-colors duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : selectedMapping.customIrrigationStartTime && selectedMapping.customIrrigationEndTime ? (
                                <div>
                                    <p className="text-gray-100">Start: <span className="font-semibold">{selectedMapping.customIrrigationStartTime}</span></p>
                                    <p className="text-gray-100">End: <span className="font-semibold">{selectedMapping.customIrrigationEndTime}</span></p>
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <p className="text-yellow-400 mb-3">No irrigation times set for this crop.</p>
                                    <div className="flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
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
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        Set Timing
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-700 p-5 rounded-lg text-center">
                        <p className="text-yellow-400 font-semibold">No crop selected</p>
                        <p className="text-gray-300 mt-1">Please select a crop from the Select Crop page first</p>
                    </div>
                )}

                {/* Real-Time Sensor Data */}
                <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-100 mb-4">Real-Time Sensor Data:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center">
                            <p className="text-gray-400 text-sm">Soil Moisture</p>
                            <p className="text-2xl font-bold text-blue-400">{sensorData.SoilMoisture}%</p>
                            {selectedMapping && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Target: {selectedMapping.customMinSoilMoisture}% - {selectedMapping.customMaxSoilMoisture}%
                                </p>
                            )}
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center">
                            <p className="text-gray-400 text-sm">Temperature</p>
                            <p className="text-2xl font-bold text-red-400">{sensorData.Temperature}°C</p>
                            {selectedMapping && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Target: {selectedMapping.customMinTemperature}°C - {selectedMapping.customMaxTemperature}°C
                                </p>
                            )}
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center">
                            <p className="text-gray-400 text-sm">Humidity</p>
                            <p className="text-2xl font-bold text-green-400">{sensorData.Humidity}%</p>
                            {selectedMapping && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Target: {selectedMapping.customMinHumidity}% - {selectedMapping.customMaxHumidity}%
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex flex-wrap gap-4 justify-between">
                    <button
                        onClick={toggleManualControl}
                        className={`px-6 py-2 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                            manualControl ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        disabled={!selectedMapping}
                    >
                        {manualControl ? 'Close Valve' : 'Open Valve Manually'}
                    </button>
                    <button
                        onClick={analyzeIrrigation}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300"
                        disabled={!selectedMapping}
                    >
                        Analyze Irrigation
                    </button>
                </div>

                {/* Analysis Result */}
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
