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

  // Function to fetch data from the database
  const fetchData = async (sensorType, timeRange) => {
    const startDate = dayjs().subtract(timeRange === "week" ? 7 : timeRange === "month" ? 30 : 1, "day").toISOString();
    try {
      const response = await fetch(`/api/sensor-data/${sensorType}?startDate=${startDate}`);
      const data = await response.json();

      setRawData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data whenever the sensor type or time range changes
  useEffect(() => {
    fetchData(sensorType, timeRange);
  }, [sensorType, timeRange]);

  // Aggregate the data for week and month
  useEffect(() => {
    const aggregateData = () => {
      let aggregatedData = [];
      if (timeRange === "day") {
        aggregatedData = rawData.map((data) => ({
          timestamp: data.timestamp,
          value: data.value,
        }));
      } else if (timeRange === "week") {
        // Group by day and calculate average for each day
        let dailyData = {};
        rawData.forEach((data) => {
          const day = dayjs(data.timestamp).format("YYYY-MM-DD");
          if (!dailyData[day]) dailyData[day] = [];
          dailyData[day].push(data.value);
        });

        aggregatedData = Object.keys(dailyData).map((day) => {
          const avgValue = dailyData[day].reduce((sum, value) => sum + value, 0) / dailyData[day].length;
          return { timestamp: day, value: avgValue };
        });
      } else if (timeRange === "month") {
        // Group by 3 days and calculate average for each 3-day period
        let threeDayData = [];
        for (let i = 0; i < rawData.length; i += 3) {
          const group = rawData.slice(i, i + 3);
          const avgValue = group.reduce((sum, data) => sum + data.value, 0) / group.length;
          const startDate = dayjs(group[0].timestamp).format("YYYY-MM-DD");
          threeDayData.push({ timestamp: startDate, value: avgValue });
        }
        aggregatedData = threeDayData;
      }

      setFilteredData(aggregatedData);
    };

    aggregateData();
  }, [rawData, timeRange]);

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
