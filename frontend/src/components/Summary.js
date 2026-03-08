// dashboard/src/components/Summary.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Summary = ({ stocks = [], holdings = [], username }) => {
  // 1. Live Calculations from the Holdings array
  const totalInvestment = holdings.reduce((sum, s) => sum + (Number(s.avg) * Number(s.qty)), 0);
  const currentMarketValue = holdings.reduce((sum, s) => {
    const livePrice = Number(s.price) || Number(s.avg);
    return sum + (livePrice * Number(s.qty));
  }, 0);

  const totalPnL = currentMarketValue - totalInvestment;
  const pnlPercentage = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;
  const isProfit = totalPnL >= 0;

  // 2. Thick Doughnut Chart Logic (Pinned Stocks)
  const pinnedStocks = stocks.filter(s => s.isPinned);

  const chartData = {
    labels: pinnedStocks.map((s) => s.name),
    datasets: [{
      data: pinnedStocks.map((s) => {
        const price = typeof s.price === 'string' ? parseFloat(s.price.replace(/[₹,]/g, '')) : s.price;
        return price || 0;
      }),
      backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0", "#ffeb3b"],
      hoverOffset: 15,
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    cutout: "45%", // Thick ring thickness
    plugins: {
      legend: {
        position: 'right',
        labels: { usePointStyle: true, padding: 25, font: { size: 14 } }
      }
    }
  };

  return (
    <div className="summary-container" style={{ padding: "30px", background: "#fff" }}>
      <h1 style={{ fontWeight: "400", fontSize: "28px" }}>Hi, {username}</h1>
      <p style={{ color: "#888", marginTop: "-5px" }}>Here is your portfolio distribution today.</p>
      
      <hr style={{ margin: "25px 0", opacity: "0.1" }} />

      {/* --- LIVE STATS SECTION --- */}
      <div style={{ display: "flex", gap: "60px", marginBottom: "40px" }}>
        <div>
          <p style={{ color: "#9b9b9b", fontSize: "12px", textTransform: "uppercase" }}>Investment</p>
          <h2 style={{ fontSize: "24px" }}>₹{totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
        </div>
      </div>

      {/* --- DOUGHNUT SECTION ONLY --- */}
      <div style={{ height: "350px", width: "100%", maxWidth: "600px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "25px", color: "#555" }}>Pinned Portfolio Distribution</h3>
        {pinnedStocks.length > 0 ? (
          <Doughnut data={chartData} options={chartOptions} />
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #ccc", borderRadius: "12px" }}>
            <p style={{ color: "#999" }}>Pin stocks in Watchlist to see the distribution.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;