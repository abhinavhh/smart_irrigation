import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Components/Profile";
import Login from "./Pages/Login";
import AddCrop from "./Components/AddCrop";
import CropDetails from "./Components/CropDetails";
import Dashboard from "./Components/Dashboard";
import Graph from "./Components/Graph";
import ControlPanel from "./Components/ControlPanel";
import Register from "./Pages/Register";
import { useState,useEffect } from "react";
import ResetPasswordRequest from "./Components/ResetPasswordRequest";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reset-password" element={<ResetPasswordRequest/>}/>
        {/* <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/register" />
            )
          }
        /> */}
        <Route path="/addCrop"element={<AddCrop />}/>
        <Route path="/cropdetails" element={<CropDetails/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/notifications" element={<Notification/>}/>
        <Route path="/graph" element={<Graph/>}/>
        <Route path="/controlpanel" element={<ControlPanel/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
  );
}

export default App;
