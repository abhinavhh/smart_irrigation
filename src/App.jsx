import { BrowserRouter as Router, Routes, Route , Navigate, useLocation} from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Components/Profile";
import { Login, Register, ForgotPassword, ResetPassword } from "./features/auth";
import { AddCrop, CropDetail } from "./features/crops";
import Graph from "./Components/Graph";
import ControlPanel from "./Components/ControlPanel";
import { useState, useEffect } from "react";
import Notification  from "./Components/Notifications";
import MultiSensorGraph from "./Components/MultiSensorGraph";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ToastContainer, Bounce } from 'react-toastify';
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import { useAuth } from "./features/auth";

function App() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/register", "/reset-password", "/forgot-password"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    
    <MantineProvider>
      {!shouldHideNavbar && <Navbar/>}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        
        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
        <Route path="/addCrop" element={<ProtectedRoute><AddCrop /></ProtectedRoute>}/>
        <Route path="/cropdetails" element={<ProtectedRoute><CropDetail /></ProtectedRoute>}/>
        <Route path="/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>}/>
        <Route path="/graph/:sensorType" element={<ProtectedRoute><Graph /></ProtectedRoute>}/>
        <Route path="/control-panel/:cropId" element={<ProtectedRoute><ControlPanel /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path="/multi-sensor-graph" element={<ProtectedRoute><MultiSensorGraph /></ProtectedRoute>}/>
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
