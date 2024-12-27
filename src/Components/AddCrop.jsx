import React, { useState } from "react";
import axiosInstance from "../Services/Api";

function AddCrop() {
  const [cropName, setCropName] = useState("");

  const handleAddCrop = (e) => {
    e.preventDefault();

    axiosInstance
      .post("/crops/add", { name: cropName })
      .then((response) => {
        console.log("Crop added:", response.data);
      })
      .catch((error) => {
        console.error("Error adding crop:", error);
      });
  };

  return (
    <form onSubmit={handleAddCrop}>
      <label>
        Crop Name:
        <input
          type="text"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
        />
      </label>
      <button type="submit">Add Crop</button>
    </form>
  );
}

export default AddCrop;
