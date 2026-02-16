import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "http://localhost:3000/login";
    }
  }, []);

  return (
    <GeneralContextProvider>
      <div className="dashboard-container" style={{ display: "flex" }}>
        
        {/* LEFT SIDE */}
        <div style={{ width: "300px" }}>
          <WatchList />
        </div>

        {/* RIGHT SIDE */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/funds" element={<Funds />} />
          </Routes>
        </div>

      </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;
