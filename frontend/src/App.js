import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./landing_page/Navbar"; 
import Footer from "./landing_page/Footer"; 
import HomePage from "./landing_page/home/HomePage";
import AboutPage from "./landing_page/about/AboutPage";
import PricingPage from "./landing_page/pricing/PricingPage";
import Signup from "./landing_page/auth/Signup"; 
import Login from "./landing_page/auth/Login"; 
import OtpVerify from "./landing_page/auth/OtpVerify"; 
import Dashboard from "./components/Dashboard"; 
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Dashboard: Independent and clean */}
        <Route path="/dashboard/user" element={<UserProfile />} />
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* 2. Landing Pages: Flat structure to prevent blank pages */}
        <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
        <Route path="/pricing" element={<><Navbar /><PricingPage /><Footer /></>} />
        <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        <Route path="/otp" element={<><Navbar /><OtpVerify /><Footer /></>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;