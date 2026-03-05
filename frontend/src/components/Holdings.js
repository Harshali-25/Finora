import React from "react";

const Holdings = ({ holdings = [] }) => {
  // DYNAMIC CALCULATION: Links the header numbers to your actual orders
  const totalInvestment = holdings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
  const totalCurrentValue = totalInvestment; // In a live app, this would use LTP (Last Traded Price)
  const totalPnL = totalCurrentValue - totalInvestment;

  const yAxisMarkers = [5000, 4000, 3000, 2000, 1000, 0];

  return (
    <div className="holdings-container">
      {/* Dynamic Summary Stats */}
      <div className="holdings-summary-stats">
        <div className="stat">
          <small>Total investment</small>
          <h3>{totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="stat">
          <small>Current value</small>
          <h3>{totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="stat">
          <small>P&L</small>
          <h3 className={totalPnL >= 0 ? "profit" : "loss"}>
            {totalPnL >= 0 ? `+${totalPnL.toFixed(2)}` : totalPnL.toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="advanced-chart-wrapper">
        <div className="y-axis">
          {yAxisMarkers.map(val => <span key={val}>{val}</span>)}
        </div>
        
        <div className="chart-main-area">
          <div className="grid-lines">
            {yAxisMarkers.map(val => <div key={val} className="grid-line"></div>)}
          </div>

          <div className="bars-container">
            {holdings.map((stock, index) => (
              <div key={index} className="bar-wrapper">
                <div 
                  className="bar-fill-pro" 
                  style={{ height: `${(stock.avg / 5000) * 100}%` }}
                  title={`Avg: ${stock.avg}`}
                ></div>
                <span className="bar-name-label">{stock.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holdings;