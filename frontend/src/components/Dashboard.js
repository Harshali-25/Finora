import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios"; // Added axios for easier POST requests
import "../Dashboard.css"; 
import Summary from "./Summary";
import Orders from "./Orders";
import Holdings from "./Holdings";
import Positions from "./Positions";
import WatchList from "./WatchList";
import TopBar from "./TopBar"; 
import AdminDashboard from "./AdminDashboard";
import StockChart from "./StockChart";
import AlertSettings from "./AlertSettings"; 
import { watchlist as initialWatchlist } from "../data/data";

function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [stocks, setStocks] = useState(initialWatchlist); 
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [alerts, setAlerts] = useState([]); 
  const [selectedStock, setSelectedStock] = useState(initialWatchlist[0]);

  // --- 1. CONSOLIDATED DATA FETCHING ---
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    try {
      // Fetch Portfolio data in parallel
      const [hRes, oRes, pRes, aRes] = await Promise.all([
        fetch("http://localhost:3002/allHoldings", { headers }),
        fetch("http://localhost:3002/allOrders", { headers }),
        fetch("http://localhost:3002/allPositions", { headers }),
        fetch("http://localhost:3002/allAlerts", { headers }) 
      ]);

      const hData = hRes.ok ? await hRes.json() : [];
      const oData = oRes.ok ? await oRes.json() : [];
      const pData = pRes.ok ? await pRes.json() : [];
      const aData = aRes.ok ? await aRes.json() : [];

      setHoldings(hData);
      setOrders(oData);
      setPositions(pData);
      setAlerts(aData);

      // --- NEW: FETCH LIVE MARKET DATA FOR ALL WATCHLIST STOCKS ---
      // This sends all names (INFY, RELIANCE, etc.) to the backend to get real Yahoo Finance prices
      const symbols = initialWatchlist.map(s => s.name);
      const marketRes = await fetch("http://localhost:3002/api/marketData", {
        method: "POST",
        headers,
        body: JSON.stringify({ symbols })
      });

      if (marketRes.ok) {
        const liveMarketData = await marketRes.json(); // Array of {name, price}

        setStocks((prevStocks) => 
          prevStocks.map((s) => {
            const liveMatch = liveMarketData.find((item) => item.name === s.name);
            if (liveMatch && liveMatch.price) {
              return { 
                ...s, 
                price: liveMatch.price, 
                // Compare live price to the static price to see if it's "Down" or "Up"
                isDown: liveMatch.price < parseFloat(s.price?.toString().replace(/,/g, "") || 0)
              };
            }
            return s;
          })
        );
      }

    } catch (err) {
      console.error("Critical Backend Sync Error:", err);
    }
  }, []);

  // --- 2. THE LIVE POLLING LOOP ---
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, [user, fetchData, navigate]);

  return (
    <div className="dashboard-wrapper">
      <TopBar username={user?.name || "User"} /> 
      <div className="dashboard-container">
        <div className="sidebar">
          <WatchList 
            stocks={stocks} 
            setStocks={setStocks} 
            holdings={holdings}
            positions={positions} 
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
            <Route path="alerts" element={
              <AlertSettings 
                mode="VIEW" 
                alerts={alerts} 
                refreshData={fetchData} 
              />
            } />
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