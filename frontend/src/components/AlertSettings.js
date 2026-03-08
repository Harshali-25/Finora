import React, { useState } from "react";

const AlertSettings = ({ selectedStock, onClose, refreshData, alerts, mode = "SET" }) => {
  // --- STATE FOR SETTING AN ALERT ---
  const [targetPrice, setTargetPrice] = useState(
    selectedStock?.price ? parseFloat(selectedStock.price.toString().replace(/,/g, "")) : 0
  );
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState("CNC");
  const [isSuccess, setIsSuccess] = useState(false);

  // --- SAVE ALERT LOGIC ---
  const handleSaveAlert = async () => {
    const token = localStorage.getItem("token");
    
    const alertData = {
      name: selectedStock.name,
      targetPrice: Number(targetPrice),
      qty: Number(qty), 
      product: product,
      status: "ACTIVE"
    };

    try {
      const res = await fetch("http://localhost:3002/newAlert", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(alertData),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          if (refreshData) refreshData();
          onClose();
        }, 1500);
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message}`);
      }
    } catch (err) {
      console.error("Failed to set alert", err);
      alert("Network error: Could not save alert.");
    }
  };

  // --- DELETE ALERT LOGIC ---
  const handleDeleteAlert = async (alertId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Delete this alert?")) return;

    try {
      // Changed endpoint from deleteAlert to cancelAlert to match your backend
      const res = await fetch(`http://localhost:3002/cancelAlert/${alertId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (res.ok) {
        if (refreshData) refreshData();
      } else {
        alert("Failed to delete alert.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // --- MODE: VIEW (The list shown in the Alerts Tab) ---
  if (mode === "VIEW") {
    return (
      <div className="orders-container">
        <h2 className="title">Active Price Alerts</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Target Price</th>
              <th>Qty</th>
              <th>Product</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts && alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <tr key={alert._id || index}>
                  <td>{alert.name}</td>
                  <td>₹{alert.targetPrice}</td>
                  {/* Default to 0 if qty is missing from old records */}
                  <td>{alert.qty !== undefined ? alert.qty : 0}</td>
                  <td>{alert.product || "CNC"}</td>
                  <td>
                    <span className="badge-active">{alert.status || "ACTIVE"}</span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDeleteAlert(alert._id)}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "#d9534f", 
                        cursor: "pointer",
                        fontWeight: "bold",
                        textDecoration: "underline"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No active alerts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // --- MODE: SET (The Modal Popup) ---
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isSuccess ? (
          <div className="success-message" style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ color: "#4caf50" }}>✓ Alert Set Successfully!</h2>
            <p>Monitoring {selectedStock?.name} for price ₹{targetPrice}</p>
          </div>
        ) : (
          <>
            <h2 className="modal-title" style={{ color: "#ff9800" }}>Set Price Alert</h2>
            <div className="modal-body">
              <div className="price-row" style={{ marginBottom: '10px' }}>
                <span>Instrument:</span> <b>{selectedStock?.name}</b>
              </div>
              <div className="price-row" style={{ marginBottom: '15px' }}>
                <span>LTP (Current):</span> ₹{selectedStock?.price}
              </div>
              
              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '5px' }}>Trigger Price (₹)</label>
                <input 
                  type="number" 
                  value={targetPrice} 
                  onChange={(e) => setTargetPrice(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div className="input-group" style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Quantity</label>
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-cancel" onClick={onClose} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                className="confirm-buy" 
                style={{ backgroundColor: "#ff9800", color: "white", border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }} 
                onClick={handleSaveAlert}
              >
                Set Alert
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlertSettings;