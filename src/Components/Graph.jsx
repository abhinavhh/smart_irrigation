import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

const Graph = () => {
  const { sensorType } = useParams();
  const [rawData, setRawData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [filter, setFilter] = useState('day');
  const navigate = useNavigate();

  // Filter raw data based on selected time range
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

      const filtered = rawData.filter((item) => 
        dayjs(item.timestamp).isAfter(cutoff)
      );

      setDisplayData(filtered);
    };

    filterData();
  }, [filter, rawData]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws/sensor-data");

    socket.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        if (receivedData.sensorType === sensorType) {
          setRawData((prevData) => {
            const newData = [...prevData, receivedData];
            // Keep last 1000 data points to prevent memory issues
            return newData.slice(-1000);
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => socket.close();
  }, [sensorType]);

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

      <h2 className="text-2xl font-bold mb-4">{sensorType} Real-Time Graph</h2>

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
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              animationDuration={1500}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;
