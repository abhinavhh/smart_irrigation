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

  const getTimeRangeTitle = () => {
    switch (filter) {
      case 'day':
        return 'Last 24 Hours (Real-time Values)';
      case 'week':
        return 'Last 7 Days (Daily Averages)';
      case 'month':
        return 'Last 4 Weeks (Weekly Averages)';
      default:
        return 'Sensor Data';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/home')} 
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
        >
          Back to Home
        </button>

        <div className="flex items-center gap-4">
          <label htmlFor="time-range" className="font-medium text-gray-800">
            Time Range:
          </label>
          <select
            id="time-range"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 4 Weeks</option>
          </select>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Real-Time Sensor Readings - {getTimeRangeTitle()}
      </h2>

      <div className="bg-white p-4 rounded shadow-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              stroke="#4B5563"
            />
            <YAxis stroke="#4B5563" />
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

      {/* Show message if no data available */}
      {displayData.length === 0 && (
        <div className="text-center mt-4 p-4 bg-yellow-100 rounded">
          No data available for this time range.
        </div>
      )}

      {/* Data summary section */}
      {displayData.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-3">Data Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-500">Data Points</p>
              <p className="text-xl font-bold">{displayData.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-500">Average Temperature</p>
              <p className="text-xl font-bold">
                {(displayData.reduce((sum, item) => sum + item.Temperature, 0) / displayData.length).toFixed(2)}°C
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-500">Average Humidity</p>
              <p className="text-xl font-bold">
                {(displayData.reduce((sum, item) => sum + item.Humidity, 0) / displayData.length).toFixed(2)}%
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-500">Average Soil Moisture</p>
              <p className="text-xl font-bold">
                {(displayData.reduce((sum, item) => sum + item.SoilMoisture, 0) / displayData.length).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSensorGraph;