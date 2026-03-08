import React from "react";

const Holdings = ({ holdings = [] }) => {
  const sanitizedHoldings = holdings.map(stock => {
    const qty = Number(stock.qty) || 0;
    const avg = Number(stock.avg) || 0;
    const livePrice = Number(stock.price) || avg;
    return {
      ...stock,
      qty,
      avg,
      livePrice,
      totalValue: qty * livePrice,
      pnl: (livePrice - avg) * qty,
    };
  });

  const currentTotalMax = sanitizedHoldings.length > 0 
    ? Math.max(...sanitizedHoldings.map(h => h.totalValue)) 
    : 1000;
  
  const topMarker = currentTotalMax > 0 ? Math.ceil(currentTotalMax / 500) * 500 : 1000;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h3 style={{ marginBottom: "20px" }}>Holdings ({holdings.length})</h3>

      {/* Table Section */}
      <div style={{ overflowX: "auto", marginBottom: "40px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee", color: "#999", fontSize: "12px" }}>
              <th style={{ padding: "12px" }}>INSTRUMENT</th>
              <th style={{ textAlign: "right" }}>QTY.</th>
              <th style={{ textAlign: "right" }}>LTP (LIVE)</th>
              <th style={{ textAlign: "right", paddingRight: "12px" }}>CUR. VAL</th>
            </tr>
          </thead>
          <tbody>
            {sanitizedHoldings.map((stock, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                <td style={{ fontWeight: "600", padding: "15px 12px" }}>{stock.name}</td>
                <td style={{ textAlign: "right" }}>{stock.qty}</td>
                <td style={{ textAlign: "right", color: "#4caf50" }}>₹{stock.livePrice.toFixed(2)}</td>
                <td style={{ textAlign: "right", paddingRight: "12px" }}>₹{stock.totalValue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- CSS-PROOF BAR CHART --- */}
      <h4 style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}>Portfolio Concentration</h4>
      
      {/* Container with fixed height to override Dashboard.css overflow issues */}
      <div style={{ 
        display: "block", 
        height: "300px", 
        width: "100%", 
        border: "1px solid #eee", 
        position: "relative",
        backgroundColor: "#fff",
        padding: "20px"
      }}>
        
        {/* Y-Axis (Absolute Positioned to avoid flex-squish) */}
        <div style={{ 
          position: "absolute", 
          left: "10px", 
          top: "20px", 
          bottom: "40px", 
          width: "50px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          fontSize: "10px",
          color: "#aaa",
          borderRight: "1px solid #eee"
        }}>
          <span>₹{topMarker}</span>
          <span>₹{topMarker / 2}</span>
          <span>0</span>
        </div>

        {/* Bars Container */}
        <div style={{ 
          marginLeft: "60px", 
          height: "240px", // Fixed height in pixels
          display: "flex", 
          alignItems: "flex-end", 
          justifyContent: "space-around" 
        }}>
          {sanitizedHoldings.map((stock, index) => {
            // Calculate height in PIXELS instead of % to bypass CSS parent height issues
            const pixelHeight = (stock.totalValue / topMarker) * 200; 
            const finalHeight = Math.max(pixelHeight, 15); // Minimum 15px height

            return (
              <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "10px", color: "#888", marginBottom: "4px" }}>
                  ₹{Math.round(stock.totalValue)}
                </span>
                <div style={{ 
                  height: `${finalHeight}px`, // Fixed Pixel height
                  width: "40px", 
                  backgroundColor: "#4184f3", 
                  borderRadius: "4px 4px 0 0" 
                }}></div>
                <span style={{ marginTop: "8px", fontSize: "11px", fontWeight: "bold" }}>{stock.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Holdings;