import React, { useState, useEffect } from "react";
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
import axios from "axios";

const Graph = () => {
  const { sensorType } = useParams();
  const [graphData, setGraphData] = useState([]);
  const [timeRange, setTimeRange] = useState("day");
  const navigate = useNavigate();

  // Fetch data based on the time range
  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/sensor/${sensorType}?filter=${timeRange}`
        );
        setGraphData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (timeRange === "day") {
      // Fetch data every 10 minutes for day range
      fetchData();
      intervalId = setInterval(fetchData, 100); // 10 minutes interval
    } else {
      // Fetch data once for week and month ranges
      fetchData();
    }

    return () => clearInterval(intervalId);
  }, [sensorType, timeRange]);

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
          <LineChart data={graphData}>
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
