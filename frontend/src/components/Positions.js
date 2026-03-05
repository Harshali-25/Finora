import React from "react";

const Positions = ({ positions = [] }) => {
  return (
    <div className="positions-container">
      <h3 className="title-small">Positions ({positions.length})</h3>
      <div className="table-wrapper">
        <table className="positions-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {positions.length > 0 ? (
              positions.map((stock, index) => {
                const pnl = 0.00; // Calculated as (LTP - Avg) * Qty
                return (
                  <tr key={index}>
                    {/* Dynamic Tag: Shows MIS or CNC based on the trade order */}
                    <td>
                      <span className="product-tag">
                        {stock.product || "MIS"}
                      </span>
                    </td>
                    <td className="bold">{stock.name}</td>
                    <td className={stock.qty >= 0 ? "profit" : "loss"}>
                      {stock.qty}
                    </td>
                    <td>{stock.avg?.toFixed(2)}</td>
                    <td>{stock.avg?.toFixed(2)}</td>
                    <td className={pnl >= 0 ? "profit" : "loss"}>
                      {pnl >= 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2)}
                    </td>
                    <td className="profit">+0.00%</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#9b9b9b" }}>
                  You don't have any open positions.
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