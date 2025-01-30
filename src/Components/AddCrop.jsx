import { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiThermometer, FiDroplet, FiCloud } from 'react-icons/fi';

const AddCrop = () => {
    const [cropData, setCropData] = useState({
        name: '',
        minSoilMoisture: '',
        maxSoilMoisture: '',
        minTemperature: '',
        maxTemperature: '',
        minHumidity: '',
        maxHumidity: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCropData({ ...cropData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post('/crops/add', cropData);
            alert('Crop Added Successfully!');
            navigate('/home');
        } catch (error) {
            alert('Failed to add crop.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-10">
            <FiPlusCircle className="text-6xl mb-4 text-green-400" />
            <h2 className="text-3xl font-semibold mb-6">Add New Crop</h2>

            <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="space-y-4">
                    {/* Crop Name */}
                    <div>
                        <label className="block text-lg font-medium text-gray-300">Crop Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter crop name"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    {/* Soil Moisture */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-300">Min Soil Moisture</label>
                            <div className="relative mt-1">
                                <FiDroplet className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="minSoilMoisture"
                                    placeholder="Min"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-300">Max Soil Moisture</label>
                            <div className="relative mt-1">
                                <FiDroplet className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="maxSoilMoisture"
                                    placeholder="Max"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Temperature */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-300">Min Temperature</label>
                            <div className="relative mt-1">
                                <FiThermometer className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="minTemperature"
                                    placeholder="Min"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-300">Max Temperature</label>
                            <div className="relative mt-1">
                                <FiThermometer className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="maxTemperature"
                                    placeholder="Max"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Humidity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-300">Min Humidity</label>
                            <div className="relative mt-1">
                                <FiCloud className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="minHumidity"
                                    placeholder="Min"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-300">Max Humidity</label>
                            <div className="relative mt-1">
                                <FiCloud className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="maxHumidity"
                                    placeholder="Max"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium mt-4"
                    >
                        Add Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCrop;
