import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { toast, Slide } from "react-toastify";

const MultiSensorGraph = () => {
  const [graphData, setGraphData] = useState([]);
  const [timeRange, setTimeRange] = useState("day");
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    const fetchSensorData = async () => {
      try {
        // Get userId from localStorage for multi-user filtering
        const userId = localStorage.getItem("userId") || "";
        const sensorTypes = ["Temperature", "Humidity", "SoilMoisture"];
        const allData = {};

        await Promise.all(
          sensorTypes.map(async (type) => {
            const response = await axios.get(
              `/sensor/${type}?filter=${timeRange}&userId=${userId}`
            );
            allData[type] = response.data;
          })
        );

        // Merge data based on Temperature array (assuming aligned arrays)
        const mergedData = [];
        allData.Temperature.forEach((tempEntry, index) => {
          mergedData.push({
            timestamp: tempEntry.timestamp,
            Temperature: tempEntry.value,
            Humidity: allData.Humidity?.[index]?.value || null,
            SoilMoisture: allData.SoilMoisture?.[index]?.value || null,
          });
        });

        if (timeRange === "day") {
          setGraphData((prevData) => {
            const combinedData = [...prevData, ...mergedData];
            return combinedData.slice(-15);
          });
        } else {
          setGraphData(mergedData);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        toast.error("Failed to fetch sensor data", {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
          transition: Slide,
        });
      }
    };

    fetchSensorData();
    intervalId = setInterval(fetchSensorData, timeRange === "day" ? 10000 : 60000);

    return () => clearInterval(intervalId);
  }, [timeRange]);

  const formatXAxis = (timestamp) => {
    if (!timestamp) return "";
    const date = dayjs(timestamp);
    switch (timeRange) {
      case "day":
        return date.format("HH:mm");
      case "week":
        return date.format("DD MMM");
      case "month":
        return date.format("W [week]");
      default:
        return date.format("HH:mm");
    }
  };

  const totalDataPoints = graphData.length;
  const averageValue =
    totalDataPoints > 0
      ? (
          graphData.reduce((sum, item) => sum + item.value, 0) / totalDataPoints
        ).toFixed(2)
      : "N/A";
  const minValue =
    totalDataPoints > 0
      ? Math.min(...graphData.map((item) => item.value)).toFixed(2)
      : "N/A";
  const maxValue =
    totalDataPoints > 0
      ? Math.max(...graphData.map((item) => item.value)).toFixed(2)
      : "N/A";

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
        >
          Back to Home
        </button>
        <div className="flex items-center gap-4">
          <label htmlFor="time-range" className="font-medium text-gray-300">
            Time Range:
          </label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-gray-600 bg-gray-800 text-white rounded"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 4 Weeks</option>
          </select>
        </div>
      </div>

      {/* Updated header */}
      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        Multi-Sensor Real-Time Readings
      </h2>

      <div className="bg-gray-800 p-4 rounded shadow-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="#A1A1AA"
            />
            <YAxis stroke="#A1A1AA" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderColor: "#38BDF8",
                color: "#E5E7EB",
              }}
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

      {graphData.length === 0 && (
        <div className="text-center mt-4 p-4 bg-yellow-800 text-yellow-200 rounded">
          No data available for this sensor type and time range.
        </div>
      )}

      {graphData.length > 0 && (
        <div className="mt-6 bg-gray-800 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-3">Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-sm text-gray-400">Data Points</p>
              <p className="text-xl font-bold">{totalDataPoints}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-sm text-gray-400">Average</p>
              <p className="text-xl font-bold">{averageValue}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-sm text-gray-400">Min Value</p>
              <p className="text-xl font-bold">{minValue}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-sm text-gray-400">Max Value</p>
              <p className="text-xl font-bold">{maxValue}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSensorGraph;
