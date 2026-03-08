import axios from "axios";

export const monitorPrices = (stocks, alerts, user) => {
  stocks.forEach(stock => {
    // Find if there is an alert set for this stock
    const activeAlert = alerts.find(a => a.name === stock.name);

    if (activeAlert && stock.price <= activeAlert.limitPrice) {
      executeAutoBuy(stock, user);
    }
  });
};

const executeAutoBuy = async (stock, user) => {
  const orderData = {
    user: user.id,
    name: stock.name,
    qty: 1,
    price: stock.price,
    mode: "BUY",
    product: "CNC", // Auto-set for long-term
  };

  try {
    await axios.post("http://localhost:3002/newOrder", orderData);
    console.log(`Auto-bought ${stock.name} at ₹${stock.price}`);
  } catch (err) {
    console.error("Auto-buy failed", err);
  }
};