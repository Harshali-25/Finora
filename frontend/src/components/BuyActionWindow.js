import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const { closeBuyWindow } = useContext(GeneralContext);

  const handleOrder = async (mode) => {
    const token = localStorage.getItem("token"); // Retrieve JWT

    try {
      await axios.post(
        "http://localhost:3002/newOrder",
        {
          name: uid,
          qty: Number(stockQuantity),
          price: Number(stockPrice),
          mode: mode, // "BUY" or "SELL"
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`${mode} Order successful for ${uid}`);
      closeBuyWindow();
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="container" id="buy-window">
      <div className="header" style={{ backgroundColor: "#4184f3" }}>
        <h3>{uid} <span>x {stockQuantity} Qty</span></h3>
      </div>
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin: ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <button className="btn btn-blue" onClick={() => handleOrder("BUY")}>Buy</button>
          <button className="btn btn-orange" style={{backgroundColor: '#ff5722'}} onClick={() => handleOrder("SELL")}>Sell</button>
          <button className="btn btn-grey" onClick={closeBuyWindow}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;