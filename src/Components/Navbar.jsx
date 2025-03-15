import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  PlusCircleIcon,
  CogIcon,
  UserCircleIcon,
  BellIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Navbar = ({ selectedCrop, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoverItem, setHoverItem] = useState(null);

  const routes = [
    { path: "/home", icon: HomeIcon, label: "Dashboard", color: "bg-blue-600" },
    { path: "/multi-sensor-graph", icon: ChartBarIcon, label: "Analytics", color: "bg-indigo-600" },
    { 
      path: "/addCrop", 
      icon: PlusCircleIcon, 
      label: selectedCrop ? "Change Crop" : "Add Crop", 
      color: "bg-emerald-600" 
    },
    { path: "/control-panel", icon: CogIcon, label: "Controls", color: "bg-amber-600" },
    { path: "/notifications", icon: BellIcon, label: "Alerts", color: "bg-purple-600" },
    { path: "/profile", icon: UserCircleIcon, label: "Profile", color: "bg-slate-600" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 left-0 w-full z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                Smart Irrigation
              </h1>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {routes.map((route) => (
                <motion.button
                  key={route.path}
                  onClick={() => navigate(route.path)}
                  onMouseEnter={() => setHoverItem(route.path)}
                  onMouseLeave={() => setHoverItem(null)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive(route.path) 
                      ? `${route.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-gray-900 ring-opacity-60 ${route.color.replace('bg-', 'ring-')}` 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <route.icon className="w-4 h-4" />
                  <span>{route.label}</span>
                  {(isActive(route.path) || hoverItem === route.path) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {/* Implement mobile menu here if needed */}
            <button className="text-gray-300 hover:text-white p-2">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;