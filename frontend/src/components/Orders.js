import React from "react";

const Orders = ({ orders = [] }) => {
  const formatOrderTime = (order) => {
    const dateValue = order.time || order.createdAt;
    const d = new Date(dateValue);
    return isNaN(d.getTime()) ? "Just now" : d.toLocaleTimeString([], { hour12: false });
  };

  return (
    <div className="orders-container">
      <h3 className="title">Orders ({orders.length})</h3>
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Instrument</th>
              <th>Product</th> {/* This section now displays dynamic data */}
              <th>Qty.</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[...orders].reverse().map((order, index) => (
              <tr key={index}>
                <td className="text-muted">{formatOrderTime(order)}</td>
                <td>
                  <span className={`order-badge ${order.mode?.toLowerCase()}`}>
                    {order.mode}
                  </span>
                </td>
                <td className="bold">{order.name}</td>
                <td>
                  {/* FIX: Shows CNC or MIS based on your trade selection */}
                  <span className="product-tag">
                    {order.product || "MIS"} 
                  </span>
                </td>
                <td>{order.qty}</td>
                <td>₹{Number(order.price).toFixed(2)}</td>
                <td><span className="status-complete">COMPLETE</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;