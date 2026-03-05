import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../Dashboard.css"; 
import Summary from "./Summary";
import Orders from "./Orders";
import Holdings from "./Holdings";
import Positions from "./Positions";
import WatchList from "./WatchList";
import TopBar from "./TopBar"; 
import AdminDashboard from "./AdminDashboard";
import StockChart from "./StockChart";
import { watchlist as initialWatchlist } from "../data/data";

function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [stocks, setStocks] = useState(initialWatchlist); 
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedStock, setSelectedStock] = useState(initialWatchlist[0]);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    try {
      const [hRes, oRes, pRes] = await Promise.all([
        fetch("http://localhost:3002/api/user/holdings", { headers }),
        fetch("http://localhost:3002/api/user/orders", { headers }),
        fetch("http://localhost:3002/api/user/positions", { headers })
      ]);

      if (hRes.ok) setHoldings(await hRes.json());
      if (oRes.ok) setOrders(await oRes.json());
      if (pRes.ok) setPositions(await pRes.json());
    } catch (err) {
      console.error("Backend Sync Error:", err);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [user, navigate, fetchData]);

  return (
    <div className="dashboard-wrapper">
      <TopBar username={user?.name || "User"} /> 
      <div className="dashboard-container">
        <div className="sidebar">
          {/* FIX: Passed 'holdings' prop here */}
          <WatchList 
              stocks={stocks} 
              setStocks={setStocks} 
              holdings={holdings}
              onSelectStock={setSelectedStock} 
              refreshData={fetchData} 
          />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={
              <>
                <Summary stocks={stocks} holdings={holdings} username={user?.name} />
                <StockChart selectedStock={selectedStock} />
              </>
            } />
            <Route path="orders" element={<Orders orders={orders} />} />
            <Route path="holdings" element={<Holdings holdings={holdings} />} />
            <Route path="positions" element={<Positions positions={positions} />} />
            {user?.role === "ADMIN" && (
              <Route path="admin" element={<AdminDashboard />} />
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;