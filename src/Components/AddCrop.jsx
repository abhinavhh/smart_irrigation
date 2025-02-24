import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiList, FiThermometer, FiDroplet, FiCloud } from 'react-icons/fi';

const SelectCrop = () => {
    const [crops, setCrops] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await axiosInstance.get('/crops/all');
                setCrops(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch crops data');
                setLoading(false);
            }
        };

        fetchCrops();
    }, []);

    const handleCropSelect = async (cropId) => {
        try {
            const response = await axiosInstance.get(`/crops/${cropId}`);
            setSelectedCrop(response.data);
        } catch (err) {
            setError('Failed to fetch crop details');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <p className="text-xl">Loading crops...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <p className="text-xl text-red-400">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-6">
            <FiList className="text-6xl mb-4 text-green-400" />
            <h2 className="text-3xl font-semibold mb-6">Select Crop</h2>

            <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Crop Selection Panel */}
                    <div className="bg-gray-700 p-4 rounded-xl">
                        <h3 className="text-xl font-medium mb-4 text-green-300">Available Crops</h3>
                        <div className="space-y-2">
                            {crops.map((crop) => (
                                <button
                                    key={crop.id}
                                    onClick={() => handleCropSelect(crop.id)}
                                    className={`w-full py-3 px-4 text-left rounded-lg transition-colors ${
                                        selectedCrop && selectedCrop.id === crop.id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-600 hover:bg-gray-500 text-gray-100'
                                    }`}
                                >
                                    {crop.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Crop Details Panel */}
                    <div className="bg-gray-700 p-4 rounded-xl">
                        {selectedCrop ? (
                            <div>
                                <h3 className="text-2xl font-semibold mb-4 text-green-300">{selectedCrop.name}</h3>
                                
                                {/* Temperature Range */}
                                <div className="mb-4">
                                    <div className="flex items-center text-lg font-medium text-gray-300">
                                        <FiThermometer className="mr-2 text-gray-400" />
                                        Temperature Range
                                    </div>
                                    <div className="mt-1 p-3 bg-gray-800 rounded-lg grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Minimum</p>
                                            <p className="text-xl font-bold">{selectedCrop.minTemperature}°C</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Maximum</p>
                                            <p className="text-xl font-bold">{selectedCrop.maxTemperature}°C</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Soil Moisture Range */}
                                <div className="mb-4">
                                    <div className="flex items-center text-lg font-medium text-gray-300">
                                        <FiDroplet className="mr-2 text-gray-400" />
                                        Soil Moisture Range
                                    </div>
                                    <div className="mt-1 p-3 bg-gray-800 rounded-lg grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Minimum</p>
                                            <p className="text-xl font-bold">{selectedCrop.minSoilMoisture}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Maximum</p>
                                            <p className="text-xl font-bold">{selectedCrop.maxSoilMoisture}%</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Humidity Range */}
                                <div className="mb-4">
                                    <div className="flex items-center text-lg font-medium text-gray-300">
                                        <FiCloud className="mr-2 text-gray-400" />
                                        Humidity Range
                                    </div>
                                    <div className="mt-1 p-3 bg-gray-800 rounded-lg grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Minimum</p>
                                            <p className="text-xl font-bold">{selectedCrop.minHumidity}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Maximum</p>
                                            <p className="text-xl font-bold">{selectedCrop.maxHumidity}%</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Use This Crop Button */}
                                <button
                                    className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                                    onClick={() => {
                                        // Here you can add logic to use the selected crop
                                        // For example, saving to local storage or redux store
                                        localStorage.setItem('selectedCrop', JSON.stringify(selectedCrop));
                                        navigate('/home');
                                    }}
                                >
                                    Use This Crop
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4">
                                <p className="text-xl mb-2">No Crop Selected</p>
                                <p className="text-center">Please select a crop from the list to view its details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectCrop;