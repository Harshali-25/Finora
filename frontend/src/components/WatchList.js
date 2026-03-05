import React, { useState } from "react";

const TradeModal = ({ stock, type, onClose, onConfirm, ownedQty }) => {
  const [qty, setQty] = useState(1);
  const [productType, setProductType] = useState("CNC"); 
  const price = parseFloat(stock.price.toString().replace(/,/g, ""));
  const total = (price * qty).toFixed(2);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title" style={{ color: type === "BUY" ? "#4184f3" : "#df514a" }}>
          {type} {stock.name}
        </h2>
        <div className="modal-body">
          <div className="product-selector">
            <button 
              className={`toggle-btn ${productType === "CNC" ? "active" : ""}`}
              onClick={() => setProductType("CNC")}
            >
              CNC <span>(Delivery)</span>
            </button>
            <button 
              className={`toggle-btn ${productType === "MIS" ? "active" : ""}`}
              onClick={() => setProductType("MIS")}
            >
              MIS <span>(Intraday)</span>
            </button>
          </div>

          <div className="price-row"><span>Market Price:</span><span className="bold">₹{stock.price}</span></div>
          {type === "SELL" && <p className="qty-info">You own: {ownedQty}</p>}
          
          <div className="input-group">
            <label>Quantity</label>
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </div>
          
          <div className="total-row"><span>Margin Required:</span><span className="bold">₹{total}</span></div>
        </div>
        <div className="modal-footer">
          <button className={type === "BUY" ? "confirm-buy" : "confirm-sell"} onClick={() => onConfirm(qty, productType)}>
            {type}
          </button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// FIX: Added 'holdings = []' to destructuring to prevent crash
const WatchList = ({ stocks = [], setStocks, holdings = [], onSelectStock, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [tradeType, setTradeType] = useState(null);

  const togglePin = (name) => {
    setStocks(prev => prev.map(s => s.name === name ? { ...s, isPinned: !s.isPinned } : s));
  };

  const handleTrade = async (qty, productType) => {
    const token = localStorage.getItem("token");
    const tradeData = {
      name: selectedTrade.name,
      qty: qty,
      price: parseFloat(selectedTrade.price.toString().replace(/,/g, "")),
      product: productType,
      mode: tradeType 
    };

    try {
      const res = await fetch("http://localhost:3002/api/user/trade", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(tradeData),
      });

      if (res.ok) {
        alert(`${tradeType} Success!`);
        refreshData(); // Refresh instead of window.location.reload() for better UX
      } else {
        const data = await res.json();
        alert(data.message || "Transaction Failed");
      }
    } catch (err) {
      alert("Server error. Is the backend running on port 3002?");
    }
    setSelectedTrade(null);
  };

  const sortedStocks = [...stocks].sort((a, b) => (b.isPinned === a.isPinned ? 0 : b.isPinned ? 1 : -1));
  const filteredStocks = sortedStocks.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search eg: infy..." 
          className="search-input" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      <ul className="list">
        {filteredStocks.map((stock, index) => (
          <li key={index} className="list-item" onClick={() => onSelectStock(stock)}>
            <div className="item-stats">
              <i 
                className={`fa fa-thumb-tack pin-btn ${stock.isPinned ? "is-pinned" : ""}`} 
                onClick={(e) => { e.stopPropagation(); togglePin(stock.name); }}
              ></i>
              <span className={stock.isDown ? "name down" : "name up"}>{stock.name}</span>
              <span className="price">{stock.price}</span>
            </div>
            <div className="actions">
              <button className="buy-btn" onClick={(e) => { e.stopPropagation(); setSelectedTrade(stock); setTradeType("BUY"); }}>Buy</button>
              <button className="sell-btn" onClick={(e) => { e.stopPropagation(); setSelectedTrade(stock); setTradeType("SELL"); }}>Sell</button>
            </div>
          </li>
        ))}
      </ul>

      {selectedTrade && (
        <TradeModal 
          stock={selectedTrade} 
          type={tradeType} 
          onClose={() => setSelectedTrade(null)} 
          onConfirm={handleTrade} 
          // FIX: This .find() won't crash now because holdings is guaranteed to be an array
          ownedQty={holdings.find(h => h.name === selectedTrade.name)?.qty || 0}
        />
      )}
    </div>
  );
};

export default WatchList;