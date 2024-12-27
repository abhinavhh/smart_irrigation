import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Services/Api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

function Graph() {
  const { sensorType } = useParams();
  const [timeRange, setTimeRange] = useState("day");
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/sensor/${sensorType}?range=${timeRange}`)
      .then((response) => {
        setGraphData(response.data);
      })
      .catch((error) => console.error("Error fetching graph data:", error));
  }, [sensorType, timeRange]);

  const chartData = {
    labels: graphData.map((data) => new Date(data.timestamp).toLocaleString()),
    datasets: [
      {
        label: `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Data`,
        data: graphData.map((data) => data.value),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.3)",
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h2>{sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Graph</h2>
      <label>
        Time Range:
        <select onChange={(e) => setTimeRange(e.target.value)} value={timeRange}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </label>
      <Line data={chartData} />
    </div>
  );
}

export default Graph;
