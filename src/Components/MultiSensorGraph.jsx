import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import axios from 'axios';

const MultiSensorGraph = () => {
  const [rawData, setRawData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [filter, setFilter] = useState('day');
  const navigate = useNavigate();

  // Fetch sensor data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/sensors/all");
        setRawData(response.data); // Set the raw data from the backend
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter data based on time range
  useEffect(() => {
    const filterData = () => {
      const now = dayjs();
      let cutoff;

      switch (filter) {
        case 'day':
          cutoff = now.subtract(24, 'hour');
          break;
        case 'week':
          cutoff = now.subtract(7, 'day');
          break;
        case 'month':
          cutoff = now.subtract(30, 'day');
          break;
        default:
          cutoff = now.subtract(24, 'hour');
      }

      const filtered = rawData.filter(item => 
        dayjs(item.timestamp).isAfter(cutoff)
      );

      // Group data by timestamp to combine sensor readings
      const groupedData = filtered.reduce((acc, curr) => {
        const timestamp = curr.timestamp;
        if (!acc[timestamp]) {
          acc[timestamp] = { timestamp };
        }
        acc[timestamp][curr.sensorType] = curr.value;
        return acc;
      }, {});

      setDisplayData(Object.values(groupedData));
    };

    if (rawData.length > 0) {
      filterData(); // Filter data when rawData is available
    }
  }, [filter, rawData]); // Re-filter when filter or rawData changes

  const formatXAxis = (timestamp) => {
    const date = dayjs(timestamp);
    switch (filter) {
      case 'day':
        return date.format('HH:mm');
      case 'week':
        return date.format('DD MMM');
      case 'month':
        return date.format('DD MMM');
      default:
        return date.format('HH:mm');
    }
  };

  const formatTooltipValue = (value, name) => {
    const unit = name === 'Temperature' ? '°C' : '%';
    return `${value}${unit}`;
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <button 
          onClick={() => navigate('/home')} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </button>

        <div className="flex items-center gap-2">
          <label className="font-medium">Show Last: </label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="day">24 Hours</option>
            <option value="week">7 Days</option>
            <option value="month">30 Days</option>
          </select>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Real-Time Sensor Readings</h2>

      <div className="border rounded p-4 bg-white shadow">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(timestamp) => dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}
              formatter={formatTooltipValue}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Temperature" 
              stroke="#FF4500" 
              dot={false}
              name="Temperature"
            />
            <Line 
              type="monotone" 
              dataKey="Humidity" 
              stroke="#1E90FF" 
              dot={false}
              name="Humidity"
            />
            <Line 
              type="monotone" 
              dataKey="SoilMoisture" 
              stroke="#32CD32" 
              dot={false}
              name="Soil Moisture"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current Values Display */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {['Temperature', 'Humidity', 'SoilMoisture'].map(sensor => {
          const latestData = displayData[displayData.length - 1];
          const value = latestData ? latestData[sensor] : 'N/A';
          const unit = sensor === 'Temperature' ? '°C' : '%';
          
          return (
            <div key={sensor} className="p-4 border rounded bg-white shadow">
              <h3 className="font-bold">{sensor}</h3>
              <p className="text-2xl">
                {value !== 'N/A' ? `${value}${unit}` : 'N/A'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSensorGraph;
