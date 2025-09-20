import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiThermometer, FiDroplet, FiCloud, FiEdit3 } from 'react-icons/fi';
import { toast, Slide, Bounce } from 'react-toastify';

const SelectCrop = () => {
    const [crops, setCrops] = useState([]); // All available crops

    // ----- SINGLE CROP SELECTION STATE ----- 
    // Previously: const [selectedCrops, setSelectedCrops] = useState([]);
    // Now: using a single selectedCrop object
    const [selectedCrop, setSelectedCrop] = useState(null);

    const [editedCropMapping, setEditedCropMapping] = useState(null); // The mapping object being edited
    const [isEditing, setIsEditing] = useState(false); // Editing mode
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    // Fetch all available crops from the backend
    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await axiosInstance.get('/crops/all', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCrops(response.data);
            } catch (err) {
                console.error("Error fetching crops:", err);
                setError('Failed to fetch crop data');
            }
        };

        fetchCrops();
    }, []);

    // Fetch the selected crop for the logged-in user from the backend.
    // If the backend returns multiple crops, we pick the first one.
    useEffect(() => {
        const fetchUserCrop = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    toast.error('User not logged in', {
                        position: "top-center",
                        autoClose: 5000,
                        transition: Bounce,
                        theme: "dark",
                    });
                    return;
                }
                const response = await axiosInstance.get(`/usercrops/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.length > 0) {
                    // For single selection, take only the first selected crop.
                    setSelectedCrop(response.data[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching selected crop:", err);
                setError('Failed to fetch selected crop data');
                setLoading(false);
            }
        };

        fetchUserCrop();
    }, []);

    // Handle crop selection/deselection for a single crop.
    const handleCropSelect = async (crop) => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            toast.error('User not logged in', {
                position: "top-center",
                autoClose: 5000,
                transition: Bounce,
                theme: "dark",
            });
            return;
        }

        // If the same crop is clicked, deselect it.
        if (selectedCrop && selectedCrop.crop.id === crop.id) {
            try {
                await axiosInstance.delete('/usercrops/deselect', {
                    params: { userId: userId, cropId: crop.id },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSelectedCrop(null);
            } catch (error) {
                console.error("Error deselecting crop:", error);
                toast.error("Failed to deselect crop", {
                    position: "top-center",
                    autoClose: 5000,
                    transition: Slide,
                    theme: "dark",
                });
                return;
            }
        } else {
            // If a different crop is already selected, deselect it first.
            if (selectedCrop) {
                try {
                    await axiosInstance.delete('/usercrops/deselect', {
                        params: { userId: userId, cropId: selectedCrop.crop.id },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } catch (error) {
                    console.error("Error deselecting previous crop:", error);
                    toast.error("Failed to deselect previous crop", {
                        position: "top-center",
                        autoClose: 5000,
                        transition: Slide,
                        theme: "dark",
                    });
                    return;
                }
            }
            try {
                // Call backend endpoint to select the new crop.
                const response = await axiosInstance.post('/usercrops/select', null, {
                    params: { userId: userId, cropId: crop.id },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Merge the returned mapping info into the crop object.
                const cropMapping = { id: response.data.id, crop: { ...crop, mappingId: response.data.id }, ...response.data };
                setSelectedCrop(cropMapping);
            } catch (error) {
                console.error("Error selecting crop:", error);
                toast.error("Failed to select crop", {
                    position: "top-center",
                    autoClose: 5000,
                    transition: Slide,
                    theme: "dark",
                });
                return;
            }
        }
    };

    // Toggle edit mode for the selected crop mapping
    const handleEditToggle = (cropMapping) => {
        console.log("Editing mapping:", cropMapping);
        setEditedCropMapping(cropMapping);
        setIsEditing(true);
    };

    // Handle changes to the input fields by updating the nested crop values in the mapping
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedMapping = { 
            ...editedCropMapping, 
            crop: { 
                ...editedCropMapping.crop, 
                [name]: Number(value) 
            }
        };
        setEditedCropMapping(updatedMapping);
        // Update the single selected crop with the updated mapping
        setSelectedCrop(updatedMapping);
    };

    const handleSaveEdit = async () => {
        if (!editedCropMapping || !editedCropMapping.id) {
            toast.error("Mapping ID missing. Please re-select the crop.", {
                position: "top-center",
                autoClose: 5000,
                transition: Bounce,
                theme: "dark",
            });
            return;
        }
        try {
            const updateData = {
                customMinTemperature: editedCropMapping.crop.minTemperature,
                customMaxTemperature: editedCropMapping.crop.maxTemperature,
                customMinHumidity: editedCropMapping.crop.minHumidity,
                customMaxHumidity: editedCropMapping.crop.maxHumidity,
                customMinSoilMoisture: editedCropMapping.crop.minSoilMoisture,
                customMaxSoilMoisture: editedCropMapping.crop.maxSoilMoisture,
            };
            await axiosInstance.put(`/usercrops/update/${editedCropMapping.id}`, updateData, {
                headers: {
                        Authorization: `Bearer ${token}`
                    }
            });
            toast.success("Crop thresholds updated successfully!", {
                position: "top-center",
                autoClose: 5000,
                transition: Slide,
                theme: "dark",
            });
            setIsEditing(false);
            setEditedCropMapping(null);
        } catch (error) {
            console.error("Error updating crop thresholds:", error);
            toast.error("Failed to update crop thresholds", {
                position: "top-center",
                autoClose: 5000,
                transition: Bounce,
                theme: "dark",
            });
        }
    };

    const handleUseThisCrop = () => {
        navigate('/home');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                Loading crops...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <p className="text-xl text-red-400">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-6">
            <h2 className="text-3xl font-semibold mb-6">Select Crop</h2>
            <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Crop Selection Panel */}
                    <div className="bg-gray-700 p-4 rounded-xl">
                        <h3 className="text-xl font-medium mb-4 text-green-300">Available Crops</h3>
                        <div className="space-y-2">
                            {crops.map((crop) => (
                                <button
                                    key={crop.id}
                                    onClick={() => handleCropSelect(crop)}
                                    className={`w-full py-3 px-4 text-left rounded-lg transition-colors ${
                                        selectedCrop && selectedCrop.crop.id === crop.id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-600 hover:bg-gray-500 text-gray-100'
                                    }`}
                                >
                                    {crop.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Crop Panel */}
                    <div className="bg-gray-700 p-4 rounded-xl">
                        <h3 className="text-xl font-medium mb-4 text-green-300">Selected Crop</h3>
                        {selectedCrop ? (
                            <div className="bg-gray-600 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold">{selectedCrop.crop.name}</p>
                                    <button
                                        onClick={() => handleEditToggle(selectedCrop)}
                                        className="flex items-center px-3 py-1 bg-gray-500 hover:bg-gray-400 rounded-lg text-sm"
                                    >
                                        <FiEdit3 className="mr-1" />
                                        Edit
                                    </button>
                                </div>

                                {/* Edit Threshold Values */}
                                {isEditing && editedCropMapping?.id === selectedCrop.id && (
                                    <div className="mt-4 space-y-4">
                                        {/* Temperature */}
                                        <div>
                                            <div className="flex items-center text-lg font-medium text-gray-300 mb-2">
                                                <FiThermometer className="mr-2 text-gray-400" />
                                                Temperature Range (°C)
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Minimum</label>
                                                    <input
                                                        type="number"
                                                        name="minTemperature"
                                                        value={editedCropMapping.crop.minTemperature}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Maximum</label>
                                                    <input
                                                        type="number"
                                                        name="maxTemperature"
                                                        value={editedCropMapping.crop.maxTemperature}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Soil Moisture */}
                                        <div>
                                            <div className="flex items-center text-lg font-medium text-gray-300 mb-2">
                                                <FiDroplet className="mr-2 text-gray-400" />
                                                Soil Moisture Range (%)
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Minimum</label>
                                                    <input
                                                        type="number"
                                                        name="minSoilMoisture"
                                                        value={editedCropMapping.crop.minSoilMoisture}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Maximum</label>
                                                    <input
                                                        type="number"
                                                        name="maxSoilMoisture"
                                                        value={editedCropMapping.crop.maxSoilMoisture}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Humidity */}
                                        <div>
                                            <div className="flex items-center text-lg font-medium text-gray-300 mb-2">
                                                <FiCloud className="mr-2 text-gray-400" />
                                                Humidity Range (%)
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Minimum</label>
                                                    <input
                                                        type="number"
                                                        name="minHumidity"
                                                        value={editedCropMapping.crop.minHumidity}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Maximum</label>
                                                    <input
                                                        type="number"
                                                        name="maxHumidity"
                                                        value={editedCropMapping.crop.maxHumidity}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Save Button */}
                                        <button
                                            onClick={handleSaveEdit}
                                            className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400">No crop selected.</p>
                        )}
                    </div>
                </div>

                {/* Use This Crop Button */}
                <button
                    className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                    onClick={handleUseThisCrop}
                >
                    Use This Crop
                </button>
            </div>
        </div>
    );
};

export default SelectCrop;



// multiple crop

// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../api/axios';
// import { useNavigate } from 'react-router-dom';
// import { FiList, FiThermometer, FiDroplet, FiCloud, FiEdit3 } from 'react-icons/fi';
// import { toast, Slide, Bounce } from 'react-toastify';

// const SelectCrop = () => {
//     const [crops, setCrops] = useState([]); // All available crops
//     const [selectedCrops, setSelectedCrops] = useState([]); // User's selected crops (mapping objects from backend)
//     const [editedCropMapping, setEditedCropMapping] = useState(null); // The mapping object being edited
//     const [isEditing, setIsEditing] = useState(false); // Editing mode
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     // Fetch all available crops from the backend
//     useEffect(() => {
//         const fetchCrops = async () => {
//             try {
//                 const response = await axiosInstance.get('/crops/all');
//                 setCrops(response.data);
//             } catch (err) {
//                 console.error("Error fetching crops:", err);
//                 setError('Failed to fetch crop data');
//             }
//         };

//         fetchCrops();
//     }, []);

//     // Fetch selected crops for the logged-in user from the backend
//     useEffect(() => {
//         const fetchUserCrops = async () => {
//             try {
//                 const userId = localStorage.getItem('userId');
//                 if (!userId) {
//                     toast.error('User not logged in', {
//                         position: "top-center",
//                         autoClose: 5000,
//                         transition: Bounce,
//                         theme: "dark",
//                     });
//                     return;
//                 }
//                 const response = await axiosInstance.get(`/usercrops/user/${userId}`);
//                 setSelectedCrops(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Error fetching selected crops:", err);
//                 setError('Failed to fetch selected crop data');
//                 setLoading(false);
//             }
//         };

//         fetchUserCrops();
//     }, []);

//     const handleCropSelect = async (crop) => {
//         const userId = localStorage.getItem("userId");
//         if (!userId) {
//             toast.error('User not logged in', {
//                 position: "top-center",
//                 autoClose: 5000,
//                 transition: Bounce,
//                 theme: "dark",
//             });
//             return;
//         }

//         // Check if the crop is already selected (compare by crop.id)
//         const isAlreadySelected = selectedCrops.some((mapping) => mapping.crop.id === crop.id);

//         let updatedCrops;
//         if (isAlreadySelected) {
//             // Deselect the crop by calling the backend DELETE endpoint
//             try {
//                 await axiosInstance.delete('/usercrops/deselect', {
//                     params: { userId: userId, cropId: crop.id }
//                 });
//                 updatedCrops = selectedCrops.filter((mapping) => mapping.crop.id !== crop.id);
//             } catch (error) {
//                 console.error("Error deselecting crop:", error);
//                 toast.error("Failed to deselect crop", {
//                     position: "top-center",
//                     autoClose: 5000,
//                     transition: Slide,
//                     theme: "dark",
//                 });
//                 return;
//             }
//         } else {
//             try {
//                 // Call backend endpoint to select the crop for the user.
//                 // Assume the endpoint returns the created mapping object including its id.
//                 const response = await axiosInstance.post('/usercrops/select', null, {
//                     params: { userId: userId, cropId: crop.id }
//                 });
//                 // Merge the returned mapping info into the crop object.
//                 const cropMapping = { id: response.data.id, crop: { ...crop, mappingId: response.data.id }, ...response.data };
//                 updatedCrops = [...selectedCrops, cropMapping];
//             } catch (error) {
//                 console.error("Error selecting crop:", error);
//                 toast.error("Failed to select crop", {
//                     position: "top-center",
//                     autoClose: 5000,
//                     transition: Slide,
//                     theme: "dark",
//                 });
//                 return;
//             }
//         }
//         setSelectedCrops(updatedCrops);
//     };

//     // When clicking the edit button, store the entire mapping object
//     const handleEditToggle = (cropMapping) => {
//         console.log("Editing mapping:", cropMapping);
//         setEditedCropMapping(cropMapping);
//         setIsEditing(true);
//     };

//     // Handle changes to the input fields by updating the nested crop values in the mapping
//     const handleInputChange = (e, mappingId) => {
//         const { name, value } = e.target;
//         const updatedMapping = { 
//             ...editedCropMapping, 
//             crop: { 
//                 ...editedCropMapping.crop, 
//                 [name]: Number(value) 
//             }
//         };
//         setEditedCropMapping(updatedMapping);

//         // Update the selectedCrops array with the updated mapping
//         const updatedMappings = selectedCrops.map((mapping) =>
//             mapping.id === mappingId ? updatedMapping : mapping
//         );
//         setSelectedCrops(updatedMappings);
//     };

//     const handleSaveEdit = async () => {
//         // Ensure we have the mapping id and the edited crop data
//         if (!editedCropMapping || !editedCropMapping.id) {
//             toast.error("Mapping ID missing. Please re-select the crop.", {
//                 position: "top-center",
//                 autoClose: 5000,
//                 transition: Bounce,
//                 theme: "dark",
//             });
//             return;
//         }
//         try {
//             const updateData = {
//                 customMinTemperature: editedCropMapping.crop.minTemperature,
//                 customMaxTemperature: editedCropMapping.crop.maxTemperature,
//                 customMinHumidity: editedCropMapping.crop.minHumidity,
//                 customMaxHumidity: editedCropMapping.crop.maxHumidity,
//                 customMinSoilMoisture: editedCropMapping.crop.minSoilMoisture,
//                 customMaxSoilMoisture: editedCropMapping.crop.maxSoilMoisture,
//             };
//             await axiosInstance.put(`/usercrops/update/${editedCropMapping.id}`, updateData);
//             toast.success("Crop thresholds updated successfully!", {
//                 position: "top-center",
//                 autoClose: 5000,
//                 transition: Slide,
//                 theme: "dark",
//             });
//             setIsEditing(false);
//             setEditedCropMapping(null);
//         } catch (error) {
//             console.error("Error updating crop thresholds:", error);
//             toast.error("Failed to update crop thresholds", {
//                 position: "top-center",
//                 autoClose: 5000,
//                 transition: Bounce,
//                 theme: "dark",
//             });
//         }
//     };

//     const handleUseTheseCrops = () => {
//         navigate('/home');
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
//                 Loading crops...
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
//                 <p className="text-xl text-red-400">{error}</p>
//                 <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">
//                     Retry
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-6">
//             <h2 className="text-3xl font-semibold mb-6">Select Crops</h2>
//             <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-2xl shadow-lg">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Crop Selection Panel */}
//                     <div className="bg-gray-700 p-4 rounded-xl">
//                         <h3 className="text-xl font-medium mb-4 text-green-300">Available Crops</h3>
//                         <div className="space-y-2">
//                             {crops.map((crop) => (
//                                 <button
//                                     key={crop.id}
//                                     onClick={() => handleCropSelect(crop)}
//                                     className={`w-full py-3 px-4 text-left rounded-lg transition-colors ${
//                                         selectedCrops.some((mapping) => mapping.crop.id === crop.id)
//                                             ? 'bg-green-600 text-white'
//                                             : 'bg-gray-600 hover:bg-gray-500 text-gray-100'
//                                     }`}
//                                 >
//                                     {crop.name}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Selected Crops Panel */}
//                     <div className="bg-gray-700 p-4 rounded-xl">
//                         <h3 className="text-xl font-medium mb-4 text-green-300">Selected Crops</h3>
//                         {selectedCrops.length > 0 ? (
//                             <div className="space-y-2">
//                                 {selectedCrops.map((mapping) => (
//                                     <div key={mapping.id} className="bg-gray-600 p-3 rounded-lg">
//                                         <div className="flex justify-between items-center">
//                                             <p className="text-lg font-semibold">{mapping.crop.name}</p>
//                                             <button
//                                                 onClick={() => handleEditToggle(mapping)}
//                                                 className="flex items-center px-3 py-1 bg-gray-500 hover:bg-gray-400 rounded-lg text-sm"
//                                             >
//                                                 <FiEdit3 className="mr-1" />
//                                                 Edit
//                                             </button>
//                                         </div>

//                                         {/* Edit Threshold Values */}
//                                         {isEditing && editedCropMapping?.id === mapping.id && (
//                                             <div className="mt-4 space-y-4">
//                                                 {/* Temperature */}
//                                                 <div>
//                                                     <div className="flex items-center text-lg font-medium text-gray-300 mb-2">
//                                                         <FiThermometer className="mr-2 text-gray-400" />
//                                                         Temperature Range (°C)
//                                                     </div>
//                                                     <div className="grid grid-cols-2 gap-4">
//                                                         <div>
//                                                             <label className="block text-sm text-gray-400 mb-1">Minimum</label>
//                                                             <input
//                                                                 type="number"
//                                                                 name="minTemperature"
//                                                                 value={editedCropMapping.crop.minTemperature}
//                                                                 onChange={(e) => handleInputChange(e, mapping.id)}
//                                                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <label className="block text-sm text-gray-400 mb-1">Maximum</label>
//                                                             <input
//                                                                 type="number"
//                                                                 name="maxTemperature"
//                                                                 value={editedCropMapping.crop.maxTemperature}
//                                                                 onChange={(e) => handleInputChange(e, mapping.id)}
//                                                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Soil Moisture */}
//                                                 <div>
//                                                     <div className="flex items-center text-lg font-medium text-gray-300 mb-2">
//                                                         <FiDroplet className="mr-2 text-gray-400" />
//                                                         Soil Moisture Range (%)
//                                                     </div>
//                                                     <div className="grid grid-cols-2 gap-4">
//                                                         <div>
//                                                             <label className="block text-sm text-gray-400 mb-1">Minimum</label>
//                                                             <input
//                                                                 type="number"
//                                                                 name="minSoilMoisture"
//                                                                 value={editedCropMapping.crop.minSoilMoisture}
//                                                                 onChange={(e) => handleInputChange(e, mapping.id)}
//                                                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <label className="block text-sm text-gray-400 mb-1">Maximum</label>
//                                                             <input
//                                                                 type="number"
//                                                                 name="maxSoilMoisture"
//                                                                 value={editedCropMapping.crop.maxSoilMoisture}
//                                                                 onChange={(e) => handleInputChange(e, mapping.id)}
//                                                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Humidity */}
//                                                 <div>
//                                                     <div className="flex items-center text-lg font-medium text-gray-300 mb-2">
//                                                         <FiCloud className="mr-2 text-gray-400" />
//                                                         Humidity Range (%)
//                                                     </div>
//                                                     <div className="grid grid-cols-2 gap-4">
//                                                         <div>
//                                                             <label className="block text-sm text-gray-400 mb-1">Minimum</label>
//                                                             <input
//                                                                 type="number"
//                                                                 name="minHumidity"
//                                                                 value={editedCropMapping.crop.minHumidity}
//                                                                 onChange={(e) => handleInputChange(e, mapping.id)}
//                                                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <label className="block text-sm text-gray-400 mb-1">Maximum</label>
//                                                             <input
//                                                                 type="number"
//                                                                 name="maxHumidity"
//                                                                 value={editedCropMapping.crop.maxHumidity}
//                                                                 onChange={(e) => handleInputChange(e, mapping.id)}
//                                                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Save Button */}
//                                                 <button
//                                                     onClick={handleSaveEdit}
//                                                     className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
//                                                 >
//                                                     Save Changes
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-gray-400">No crops selected.</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Use These Crops Button */}
//                 <button
//                     className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
//                     onClick={handleUseTheseCrops}
//                 >
//                     Use These Crops
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SelectCrop;
