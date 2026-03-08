import React, { useRef } from "react";

const Positions = ({ positions = [] }) => {
  // We use a ref to track previous prices to see if they changed for the visual flash
  const prevPricesRef = useRef({});

  return (
    <div className="positions-container" style={{ padding: "20px", background: "#fff", minHeight: "100vh" }}>
      <h3 className="section-title" style={{ marginBottom: "25px", fontWeight: "400", color: "#444", fontSize: "20px" }}>
        Positions ({positions.length})
      </h3>
      
      <div className="table-wrapper">
        <table className="positions-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee", color: "#9b9b9b", fontSize: "12px" }}>
              <th style={{ padding: "12px", fontWeight: "400" }}>Product</th>
              <th style={{ fontWeight: "400" }}>Instrument</th>
              <th style={{ fontWeight: "400", textAlign: "right" }}>Qty.</th>
              <th style={{ fontWeight: "400", textAlign: "right" }}>Avg.</th>
              <th style={{ fontWeight: "400", textAlign: "right" }}>LTP (Live)</th>
              <th style={{ fontWeight: "400", textAlign: "right" }}>P&L</th>
              <th style={{ fontWeight: "400", textAlign: "right", paddingRight: "12px" }}>Chg. (%)</th>
            </tr>
          </thead>
          <tbody>
            {positions.length > 0 ? (
              positions.map((stock, index) => {
                const qty = Number(stock.qty) || 0;
                const avg = Number(stock.avg) || 0;
                const ltp = Number(stock.price) || avg; 
                const pnl = (ltp - avg) * qty;
                const isProfit = pnl >= 0;

                // --- Price Change Detection ---
                const prevPrice = prevPricesRef.current[stock.name];
                const priceChanged = prevPrice !== undefined && prevPrice !== ltp;
                prevPricesRef.current[stock.name] = ltp;

                // --- Percentage Change Calculation ---
                // Prevents division by zero if avg is 0
                const chgPercentage = avg !== 0 ? ((pnl / (avg * qty)) * 100).toFixed(2) : "0.00";

                return (
                  <tr key={stock._id || index} style={{ 
                    borderBottom: "1px solid #eee", 
                    fontSize: "13px",
                    transition: "background-color 0.8s ease",
                    backgroundColor: priceChanged ? (ltp > prevPrice ? "#f0fdf4" : "#fef2f2") : "transparent" 
                  }}>
                    <td style={{ padding: "18px 12px" }}>
                      <span style={{ 
                        backgroundColor: "#f4f4f4", 
                        padding: "2px 6px", 
                        borderRadius: "2px", 
                        fontSize: "10px", 
                        color: "#666",
                        fontWeight: "600",
                        textTransform: "uppercase" 
                      }}>
                        {stock.product || "MIS"}
                      </span>
                    </td>
                    <td style={{ fontWeight: "600", color: "#444" }}>{stock.name}</td>
                    <td style={{ textAlign: "right" }}>{qty}</td>
                    <td style={{ textAlign: "right" }}>{avg.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{ 
                      textAlign: "right", 
                      fontWeight: "700",
                      color: priceChanged ? (ltp > prevPrice ? "#4caf50" : "#df514a") : "#444" 
                    }}>
                      {ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ 
                      textAlign: "right", 
                      color: isProfit ? "#4caf50" : "#df514a", 
                      fontWeight: "700" 
                    }}>
                      {isProfit ? `+${pnl.toFixed(2)}` : pnl.toFixed(2)}
                    </td>
                    <td style={{ 
                      textAlign: "right", 
                      color: isProfit ? "#4caf50" : "#df514a", 
                      paddingRight: "12px",
                      fontWeight: "500"
                    }}>
                      {chgPercentage}%
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "80px", color: "#9b9b9b" }}>
                  <div style={{ fontSize: "16px", marginBottom: "10px" }}>No active positions</div>
                  <div style={{ fontSize: "12px" }}>Place an order from the watchlist to see it here.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Positions;