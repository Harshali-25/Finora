import React, { useState } from "react";

/* --- TRADE & ALERT MODAL --- */
const TradeModal = ({ stock, type, onClose, onConfirm, onSetAlert, ownedQty, livePrice }) => {
  const [qty, setQty] = useState(1);
  const [productType, setProductType] = useState("CNC"); 
  const [isAlertMode, setIsAlertMode] = useState(false); 
  
  const currentMarketPrice = livePrice || parseFloat(stock.price?.toString().replace(/,/g, "")) || 0;
  const [targetPrice, setTargetPrice] = useState(currentMarketPrice);
  
  const totalValue = (isAlertMode ? targetPrice * qty : currentMarketPrice * qty).toFixed(2);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title" style={{ color: isAlertMode ? "#ff9800" : (type === "BUY" ? "#4184f3" : "#df514a") }}>
          {isAlertMode ? "SET PRICE ALERT" : `${type} ${stock.name}`}
        </h2>
        
        <div className="modal-body">
          <div className="product-selector">
            <button className={`toggle-btn ${productType === "CNC" ? "active" : ""}`} onClick={() => setProductType("CNC")}>
              CNC <span>(Delivery)</span>
            </button>
            <button className={`toggle-btn ${productType === "MIS" ? "active" : ""}`} onClick={() => setProductType("MIS")}>
              MIS <span>(Intraday)</span>
            </button>
          </div>

          <div className="price-row">
            <span>Market Price:</span>
            <span className="bold">₹{currentMarketPrice.toLocaleString('en-IN')}</span>
          </div>

          <div style={{ margin: "15px 0", display: "flex", alignItems: "center", gap: "10px", background: "#fefae0", padding: "10px", borderRadius: "4px" }}>
            <input type="checkbox" id="alertToggle" checked={isAlertMode} onChange={() => setIsAlertMode(!isAlertMode)} />
            <label htmlFor="alertToggle" style={{ fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              Set Alert (Auto-buy when price hits target)
            </label>
          </div>

          {isAlertMode && (
            <div className="input-group">
              <label>Target Price (₹)</label>
              <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} style={{ borderColor: "#ff9800" }} />
            </div>
          )}

          <div className="input-group" style={{ marginTop: "10px" }}>
            <label>Quantity</label>
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </div>

          <div className="total-row">
            <span>{isAlertMode ? "Estimated Value:" : "Total Value:"}</span>
            <span className="bold">₹{Number(totalValue).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="modal-footer">
          {isAlertMode ? (
            <button className="confirm-buy" style={{ background: "#ff9800" }} onClick={() => onSetAlert(qty, targetPrice, productType)}>SET ALERT</button>
          ) : (
            <button className={type === "BUY" ? "confirm-buy" : "confirm-sell"} onClick={() => onConfirm(qty, productType, currentMarketPrice)}>
              {type}
            </button>
          )}
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* --- MAIN WATCHLIST COMPONENT --- */
const WatchList = ({ stocks = [], setStocks, holdings = [], positions = [], refreshData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [tradeType, setTradeType] = useState(null);

  const togglePin = (name) => {
    setStocks(prev => prev.map(s => s.name === name ? { ...s, isPinned: !s.isPinned } : s));
  };

  const getLatestPrice = (stockName, defaultPrice) => {
    const liveStock = stocks.find(s => s.name === stockName);
    if (liveStock && liveStock.price && liveStock.price !== defaultPrice) {
      return Number(liveStock.price);
    }
    const portfolioData = [...holdings, ...positions].find(item => item.name === stockName);
    return portfolioData ? Number(portfolioData.price) : parseFloat(defaultPrice.toString().replace(/,/g, ""));
  };

  const handleTrade = async (qty, productType, executedPrice) => {
    const token = localStorage.getItem("token");
    const tradeData = { name: selectedTrade.name, qty, price: executedPrice, product: productType, mode: tradeType };

    try {
      const res = await fetch("http://localhost:3002/newOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(tradeData),
      });
      if (res.ok) {
        alert(`${tradeType} Success! Order executed at ₹${executedPrice}`);
        if(refreshData) refreshData(); 
        setSelectedTrade(null);
      }
    } catch (err) {
      alert("Trade Failed");
    }
  };

  // RESTORED: handleSetAlert function definition
  const handleSetAlert = async (qty, targetPrice, productType) => {
    const token = localStorage.getItem("token");
    const alertData = {
      name: selectedTrade.name,
      qty: qty,
      targetPrice: targetPrice,
      product: productType,
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
        alert(`Alert Set! Auto-order created for ${selectedTrade.name} at ₹${targetPrice}`);
        if(refreshData) refreshData();
        setSelectedTrade(null);
      }
    } catch (err) {
      alert("Error setting alert");
    }
  };

  const filteredStocks = stocks
    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (b.isPinned === a.isPinned ? 0 : b.isPinned ? 1 : -1));

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input type="text" placeholder="Search stocks..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <span className="live-badge">● LIVE</span>
      </div>

      <ul className="list">
        {filteredStocks.map((stock, index) => {
          const currentPrice = getLatestPrice(stock.name, stock.price);
          const isDown = currentPrice < parseFloat(stock.price.toString().replace(/,/g, ""));

          return (
            <li key={index} className="list-item">
              <div className="item-stats">
                <i className={`fa fa-thumb-tack pin-btn ${stock.isPinned ? "is-pinned" : ""}`} onClick={() => togglePin(stock.name)}></i>
                <span className={isDown ? "name down" : "name up"}>{stock.name}</span>
                <span className="price" style={{ color: isDown ? "#df514a" : "#4caf50" }}>
                  ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="actions">
                <button className="buy-btn" onClick={() => { setSelectedTrade(stock); setTradeType("BUY"); }}>Buy</button>
                <button className="sell-btn" onClick={() => { setSelectedTrade(stock); setTradeType("SELL"); }}>Sell</button>
              </div>
            </li>
          );
        })}
      </ul>

      {selectedTrade && (
        <TradeModal 
          stock={selectedTrade} 
          livePrice={getLatestPrice(selectedTrade.name, selectedTrade.price)}
          type={tradeType} 
          onClose={() => setSelectedTrade(null)} 
          onConfirm={handleTrade} 
          onSetAlert={handleSetAlert} 
          ownedQty={holdings.find(h => h.name === selectedTrade.name)?.qty || 0}
        />
      )}
    </div>
  );
};

export default WatchList;