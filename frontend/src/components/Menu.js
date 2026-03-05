import React from "react";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="menu-container">
      <div className="menus">
        {/* Using the .list class from Section 4 of your CSS to remove bullets */}
        <ul className="list" style={{ display: "flex", gap: "20px" }}>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard">
              <p className={isActive("/dashboard") ? "menu selected" : "menu"}>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard/orders">
              <p className={isActive("/dashboard/orders") ? "menu selected" : "menu"}>Orders</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard/holdings">
              <p className={isActive("/dashboard/holdings") ? "menu selected" : "menu"}>Holdings</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard/positions">
              <p className={isActive("/dashboard/positions") ? "menu selected" : "menu"}>Positions</p>
            </Link>
          </li>
        </ul>
      </div>
      <hr className="divider" />
    </div>
  );
};

export default Menu; 