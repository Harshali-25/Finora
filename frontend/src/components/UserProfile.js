import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.user);
      } catch (err) {
        console.error("Error fetching profile", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "http://localhost:3001";
        }
      } finally {
        setLoading(false); // Stop loading regardless of outcome
      }
    };
    if (token) fetchProfile();
    else setLoading(false);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "http://localhost:3001"; 
  };

  // 1. Show loader while waiting for API
  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "100px", fontSize: "18px", color: "#666" }}>
      Loading Profile...
    </div>
  );

  // 2. Handle case where user is not logged in or data failed
  if (!userData) return (
    <div style={{ textAlign: "center", padding: "100px" }}>
      <p>No profile data found. Please log in again.</p>
      <button onClick={handleLogout} style={{ color: "#4184f3", cursor: "pointer", border: "none", background: "none", textDecoration: "underline" }}>
        Go to Login
      </button>
    </div>
  );

  return (
    <div className="profile-wrapper" style={{ padding: "50px", display: "flex", justifyContent: "center" }}>
      <div className="profile-card" style={{ 
        width: "400px", 
        textAlign: "center", 
        backgroundColor: "#fff",
        padding: "40px", 
        borderRadius: "12px", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0" 
      }}>
        {/* FIXED: Added ?. to prevent charAt error */}
        <div style={{ 
          width: "90px", 
          height: "90px", 
          backgroundColor: "#f5d0fe", 
          borderRadius: "50%", 
          margin: "0 auto 20px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: "#d946ef", 
          fontSize: "36px",
          fontWeight: "bold"
        }}>
          {userData?.name?.charAt(0) || "U"}
        </div>

        <h2 style={{ margin: "5px 0", color: "#222", fontWeight: "600" }}>{userData?.name || "User"}</h2>
        <p style={{ color: "#888", marginBottom: "30px", fontSize: "14px" }}>{userData?.email}</p>
        
        <div style={{ backgroundColor: "#f8faff", padding: "20px", borderRadius: "8px", marginBottom: "25px" }}>
          <span style={{ fontSize: "11px", color: "#4184f3", fontWeight: "700", letterSpacing: "1px" }}>ACCOUNT BALANCE</span>
          <h1 style={{ margin: "10px 0 0", color: "#222", fontSize: "32px" }}>
            ₹ {userData?.balance?.toLocaleString('en-IN') || "0.00"}
          </h1>
        </div>

        <button style={{ 
          width: "100%", 
          padding: "14px", 
          borderRadius: "6px", 
          border: "none", 
          backgroundColor: "#4184f3", 
          color: "white", 
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "15px",
          marginBottom: "12px"
        }}>
          Add Funds
        </button>

        <button 
          onClick={handleLogout}
          style={{ 
            width: "100%", 
            padding: "14px", 
            borderRadius: "6px", 
            border: "1px solid #ff4d4f", 
            backgroundColor: "transparent", 
            color: "#ff4d4f", 
            cursor: "pointer", 
            fontWeight: "600",
            fontSize: "15px"
          }}
        >
          Logout from Finora
        </button>
      </div>
    </div>
  );
};

export default UserProfile;