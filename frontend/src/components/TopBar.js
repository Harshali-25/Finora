import React from "react";
import { Link, useLocation } from "react-router-dom";

const TopBar = ({ username }) => {
  const location = useLocation();

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
          <li><Link to="/dashboard" className={`menu ${location.pathname === "/dashboard" ? "selected" : ""}`}>Dashboard</Link></li>
          <li><Link to="/dashboard/orders" className="menu">Orders</Link></li>
          <li><Link to="/dashboard/holdings" className="menu">Holdings</Link></li>
          <li><Link to="/dashboard/positions" className="menu">Positions</Link></li>
        </ul>
      </nav>

      {/* Profile link leads to User page */}
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