import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [overallInvestment, setOverallInvestment] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch Profile Details
        const profileRes = await axios.get("http://localhost:3002/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(profileRes.data.user);

        // 2. Fetch Holdings
        const holdingsRes = await axios.get("http://localhost:3002/api/holdings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const total = holdingsRes.data.reduce((sum, stock) => 
          sum + (Number(stock.qty || 0) * Number(stock.avg || 0)), 0);
        
        setOverallInvestment(total);
      } catch (err) {
        console.error("API Error - pulling from local storage");
        
        // FAILSAFE: If API fails, pull the name exactly how the Navbar does
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          setUserData(storedUser);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAllData();
    else setLoading(false);
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // Same port redirect
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Loading profile...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", width: "100%" }}>
      <div style={{ 
        width: "400px", padding: "40px", textAlign: "center", 
        backgroundColor: "#fff", borderRadius: "15px", border: "1px solid #eee",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)" 
      }}>
        
        {/* Avatar Circle */}
        <div style={{ 
          width: "80px", height: "80px", backgroundColor: "#f5d0fe", 
          borderRadius: "50%", margin: "0 auto 20px", display: "flex", 
          alignItems: "center", justifyContent: "center", color: "#d946ef", 
          fontSize: "32px", fontWeight: "bold" 
        }}>
          {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* Dynamic Name - Matches your Navbar */}
        <h1 style={{ margin: "0 0 5px 0", fontSize: "28px", color: "#333" }}>
          {userData?.name || "User"}
        </h1>
        <p style={{ color: "#888", marginBottom: "35px" }}>{userData?.email}</p>

        <div style={{ textAlign: "left", marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f9f9f9" }}>
            <span style={{ color: "#666" }}>Overall Investment</span>
            <span style={{ fontWeight: "700" }}>₹{overallInvestment.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          style={{ width: "100%", padding: "12px", border: "1px solid #ff4d4f", color: "#ff4d4f", background: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Logout from Finora
        </button>
      </div>
    </div>
  );
};

export default UserProfile;