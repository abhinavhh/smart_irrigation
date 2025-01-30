import { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
            alert('Failed to add crop.',error);
        }
    };

    return (
        <div>
            <h2>Add Crop</h2>
            <input type="text" name="name" placeholder="Crop Name" onChange={handleChange} />
            <input type="number" name="minSoilMoisture" placeholder="Min Soil Moisture" onChange={handleChange} />
            <input type="number" name="maxSoilMoisture" placeholder="Max Soil Moisture" onChange={handleChange} />
            <input type="number" name="minTemperature" placeholder="Min Temperature" onChange={handleChange} />
            <input type="number" name="maxTemperature" placeholder="Max Temperature" onChange={handleChange} />
            <input type="number" name="minHumidity" placeholder="Min Humidity" onChange={handleChange} />
            <input type="number" name="maxHumidity" placeholder="Max Humidity" onChange={handleChange} />
            <button onClick={handleSubmit}>Add Crop</button>
        </div>
    );
};

export default AddCrop;
