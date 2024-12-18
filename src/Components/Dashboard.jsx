import { useEffect, useState } from "react"
import api from "../Services/Api";


const Dashboard = () => {
    const[sensorData,setSensorData] = useState([]);
    useEffect(() => {
        api.get("/sensor/all")
            .then((response) => setSensorData(response.data))
            .catch((error) => console.log("Error fetching data: ",error));
    },[]);
  return (
    <div>
      <h2>Sensor Data</h2>
      <table>
        <thead>
            <tr>
                <th>Type</th>
                <th>Value</th>
                <th>TimeStamp</th>
            </tr>
        </thead>
        <tbody>
            {sensorData.map((data,index) => (
                <tr key={index}>
                    <td>{data.sensorType}</td>
                    <td>{data.sensorValue}</td>
                    <td>{data.timeStamp? new Date(data.timeStamp).toLocaleDateString():"Invaid Date"}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
