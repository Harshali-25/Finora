import React, { useState, createContext } from "react";

const GeneralContext = createContext();

export const GeneralContextProvider = (props) => {
  const [pinnedStocks, setPinnedStocks] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [uid, setUid] = useState(localStorage.getItem("uid") || "");

  const togglePin = (stockName) => {
    setPinnedStocks((prev) => 
      prev.includes(stockName) ? prev.filter(n => n !== stockName) : [...prev, stockName]
    );
  };

  return (
    <GeneralContext.Provider value={{ pinnedStocks, togglePin, user, uid }}>
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;