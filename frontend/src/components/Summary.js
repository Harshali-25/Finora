import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Summary = ({ stocks, username }) => {
  const pinnedStocks = stocks.filter(s => s.isPinned);

  const totalAmount = stocks.reduce((sum, s) => {
    const priceStr = s.price.toString().replace(/,/g, ''); 
    const cleanPrice = parseFloat(priceStr);
    return sum + (isNaN(cleanPrice) ? 0 : cleanPrice);
  }, 0);

  const data = {
    labels: pinnedStocks.map((s) => s.name),
    datasets: [
      {
        data: pinnedStocks.map((s) => {
            const p = s.price.toString().replace(/,/g, '');
            return parseFloat(p);
        }),
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0", "#ffeb3b"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="summary-container" style={{ width: "100%", height: "100%" }}>
      <h1 style={{ fontWeight: "400", fontSize: "28px", margin: "0 0 5px 0" }}>Hi, {username}</h1>
      <hr style={{ margin: "15px 0", opacity: "0.1" }} />
      
      <div className="section" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "22px", color: "#444", marginBottom: "2px" }}>
          Total Investment: ₹{totalAmount.toLocaleString()}
        </h2>
        <p style={{ color: "#9b9b9b", fontSize: "12px" }}>Total value based on current market prices</p>
      </div>

      <div className="section">
        <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Pinned Portfolio Distribution</h3>
        
        {/* SMALLER CHART CONTAINER: Reduced to 280px to prevent cut-off */}
        <div style={{ width: "280px", height: "280px", position: "relative" }}>
          {pinnedStocks.length > 0 ? (
            <Doughnut 
              data={data} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'bottom', 
                    labels: { boxWidth: 10, font: { size: 10 } } 
                  } 
                } 
              }} 
            />
          ) : (
            <p style={{ color: "#9b9b9b", fontStyle: "italic", fontSize: "13px" }}>
              Pin stocks in the watchlist to see your distribution chart here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;