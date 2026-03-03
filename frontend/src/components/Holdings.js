import React, { useState, useEffect } from "react";
import axios from "axios";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  
  // 1. Get the current user's ID from localStorage
  const userUID = localStorage.getItem("uid");

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        // 2. Fetch data from your backend
        const res = await axios.get("http://localhost:3002/allHoldings");
        
        // 3. FILTER: Only keep holdings that match THIS user's UID
        const userSpecificData = res.data.filter(item => item.uid === userUID);
        
        setAllHoldings(userSpecificData);
      } catch (err) {
        console.error("Error fetching personal holdings", err);
      }
    };
    fetchHoldings();
  }, [userUID]);

  return (
    <div className="holdings-container content">
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0;
              
              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Holdings;