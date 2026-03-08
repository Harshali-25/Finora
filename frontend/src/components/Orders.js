import React from "react";

const Orders = ({ orders = [] }) => {
  // Function to format the ISO string into a clean time format (e.g., 9:15:02 am)
  const formatTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).toLowerCase();
    } catch (e) {
      return timeStr || "--:--:--"; 
    }
  };

  return (
    <div className="orders-container" style={{ padding: "20px", background: "#fff", minHeight: "100vh" }}>
      <h3 className="title" style={{ marginBottom: "25px", fontWeight: "400", color: "#444", fontSize: "20px" }}>
        Orders ({orders.length})
      </h3>
      
      <div className="table-wrapper">
        <table className="orders-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee", color: "#999", fontSize: "12px" }}>
              <th style={{ padding: "12px", fontWeight: "400" }}>Time</th>
              <th style={{ fontWeight: "400" }}>Type</th>
              <th style={{ fontWeight: "400" }}>Instrument</th>
              <th style={{ fontWeight: "400" }}>Product</th>
              <th style={{ fontWeight: "400", textAlign: "right" }}>Qty.</th>
              <th style={{ fontWeight: "400", textAlign: "right" }}>Price</th>
              <th style={{ fontWeight: "400", textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              [...orders].reverse().map((order, index) => {
                const isBuy = order.mode?.toUpperCase() === "BUY";
                
                return (
                  <tr key={order._id || index} style={{ borderBottom: "1px solid #f9f9f9", fontSize: "13px" }}>
                    <td style={{ padding: "18px 12px", color: "#666" }}>
                      {formatTime(order.createdAt || order.time)}
                    </td>
                    
                    <td>
                      <span style={{ 
                        padding: "2px 6px", 
                        borderRadius: "2px", 
                        fontSize: "10px", 
                        fontWeight: "700",
                        backgroundColor: isBuy ? "#e3f2fd" : "#fbe9e7",
                        color: isBuy ? "#2196f3" : "#ff5722"
                      }}>
                        {order.mode?.toUpperCase()}
                      </span>
                    </td>
                    
                    <td style={{ fontWeight: "700", color: "#444" }}>{order.name}</td>
                    
                    <td>
                      <span style={{ 
                        backgroundColor: "#f4f4f4", 
                        padding: "2px 5px", 
                        borderRadius: "2px", 
                        fontSize: "10px", 
                        color: "#666" 
                      }}>
                        {order.product ? order.product.toUpperCase() : "CNC"}
                      </span>
                    </td>
                    
                    <td style={{ textAlign: "right" }}>{order.qty}</td>
                    <td style={{ textAlign: "right", fontWeight: "600" }}>
                      ₹{Number(order.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <span style={{ 
                          fontSize: "11px", 
                          color: "#4caf50", 
                          fontWeight: "700",
                          letterSpacing: "0.5px"
                        }}>
                          COMPLETE
                        </span>
                        
                        {/* AUTO-ALERT Identification */}
                        {order.isAuto && (
                          <span style={{ 
                            fontSize: "9px", 
                            background: "#fff7e6", 
                            color: "#d48806", 
                            border: "1px solid #ffe58f", 
                            padding: "0 5px", 
                            borderRadius: "10px",
                            fontWeight: "700"
                          }}>
                            ⚡ AUTO
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "80px", color: "#999" }}>
                  No orders found for this session.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;