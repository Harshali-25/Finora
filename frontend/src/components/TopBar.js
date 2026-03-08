import React from "react";
import { Link, useLocation } from "react-router-dom";

const TopBar = ({ username }) => {
  const location = useLocation();

  // Helper to determine if a link is active
  const isActive = (path) => location.pathname === path ? "selected" : "";

  return (
    <div className="topbar-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", borderBottom: "1px solid #eee", height: "60px" }}>
      <div className="indices-container" style={{ display: "flex", gap: "20px" }}>
        <div className="nifty">
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>NIFTY 50</span> <span style={{ color: "#4caf50" }}>18,105.40</span>
        </div>
        <div className="sensex">
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>SENSEX</span> <span style={{ color: "#df4949" }}>100.2</span>
        </div>
      </div>

      <nav className="menus">
        <ul className="list" style={{ display: "flex", gap: "25px", listStyle: "none", margin: 0 }}>
          <li><Link to="/dashboard" className={`menu ${isActive("/dashboard")}`}>Dashboard</Link></li>
          <li><Link to="/dashboard/orders" className={`menu ${isActive("/dashboard/orders")}`}>Orders</Link></li>
          <li><Link to="/dashboard/holdings" className={`menu ${isActive("/dashboard/holdings")}`}>Holdings</Link></li>
          <li><Link to="/dashboard/positions" className={`menu ${isActive("/dashboard/positions")}`}>Positions</Link></li>
          
          {/* UPDATION: Added Alerts link to the navigation */}
          <li>
            <Link to="/dashboard/alerts" className={`menu ${isActive("/dashboard/alerts")}`}>
              Alerts
            </Link>
          </li>
        </ul>
      </nav>

      <Link to="/dashboard/user" style={{ textDecoration: "none" }}>
        <div className="profile-container">
          <div className="avatar" style={{ background: "#f5d0fe", color: "#d946ef", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
            {username?.charAt(0) || "U"}
          </div>
          <p className="username-text" style={{ margin: 0, color: "#666", fontSize: "14px" }}>{username}</p>
        </div>
      </Link>
    </div>
  );
};

export default TopBar;