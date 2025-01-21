import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const Graph = () => {
  const { sensorType } = useParams(); // Sensor type from the route
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeRange, setTimeRange] = useState("day");
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // WebSocket connection for real-time data
  useEffect(() => {
    socketRef.current = new WebSocket("ws://192.168.1.63:8080/ws/sensor-data");

    socketRef.current.onopen = () => {
      console.log("WebSocket connected!");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data[sensorType]) {
          const newData = {
            timestamp: Date.now(),
            value: data[sensorType],
          };

          setRawData((prevData) => {
            const updatedData = [...prevData, newData];
            // Keep only the last 1000 data points
            return updatedData.slice(-1000);
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("WebSocket disconnected!");
      }
    };
  }, [sensorType]);

  // Filter data based on the selected time range
  useEffect(() => {
    const filterData = () => {
      const now = dayjs();
      let cutoff;

      switch (timeRange) {
        case "day":
          cutoff = now.subtract(1, "day");
          break;
        case "week":
          cutoff = now.subtract(7, "day");
          break;
        case "month":
          cutoff = now.subtract(1, "month");
          break;
        default:
          cutoff = now.subtract(1, "day");
      }

      const filtered = rawData.filter((data) =>
        dayjs(data.timestamp).isAfter(cutoff)
      );
      setFilteredData(filtered);
    };

    // Update the filtered data every 5 seconds
    const interval = setInterval(filterData, 5000);
    return () => clearInterval(interval);
  }, [timeRange, rawData]);

  // Format X-axis labels based on the selected time range
  const formatXAxis = (timestamp) => {
    const date = dayjs(timestamp);
    switch (timeRange) {
      case "day":
        return date.format("HH:mm");
      case "week":
        return date.format("DD MMM");
      case "month":
        return date.format("DD MMM");
      default:
        return date.format("HH:mm");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/home")}
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
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        {sensorType} Real-Time Graph
      </h2>

      {/* Graph */}
      <div className="bg-white p-4 rounded shadow-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="#4B5563"
            />
            <YAxis stroke="#4B5563" />
            <Tooltip
              labelFormatter={(timestamp) =>
                dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss")
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38BDF8"
              strokeWidth={2}
              animationDuration={500}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;
