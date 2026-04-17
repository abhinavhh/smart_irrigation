import { BrowserRouter as Router, Routes, Route , Navigate, useLocation} from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Components/Profile";
import { Login, Register, ForgotPassword, ResetPassword } from "./features/auth";
import AddCrop from "./Components/AddCrop";
import CropDetails from "./Components/CropDetails";
import Graph from "./Components/Graph";
import ControlPanel from "./Components/ControlPanel";
import { useState, useEffect } from "react";
import Notification  from "./Components/Notifications";
import MultiSensorGraph from "./Components/MultiSensorGraph";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ToastContainer, Bounce } from 'react-toastify';
import Navbar from "./Components/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  const hideNavbarRoutes = ["/", "/register", "/reset-password", "/forgot-password"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    
    <MantineProvider>
      {!shouldHideNavbar && <Navbar/>}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login onLogin={handleLogin}/>} />
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/home" element={<Home onLogout={handleLogout} />}/>
        <Route path="/addCrop"element={<AddCrop />}/>
        <Route path="/cropdetails" element={<CropDetails/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/notifications" element={<Notification/>}/>
        <Route path="/graph/:sensorType" element={<Graph/>}/>
        <Route path="/control-panel/:cropId" element={<ControlPanel/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/multi-sensor-graph" element={<MultiSensorGraph/>}/>
      </Routes>
    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />
    </MantineProvider>
  );
}

export default App;
