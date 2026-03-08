const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance(); // Initialize instance to manage cookies/crumbs

const AlertModel = require("../model/AlertModel");
const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");

const checkAlerts = async () => {
  try {
    console.log("Checking stock alerts...");
    
    // 1. Get all ACTIVE alerts from the database
    const activeAlerts = await AlertModel.find({ status: "ACTIVE" });

    for (const alert of activeAlerts) {
      try {
        const ticker = alert.name.endsWith('.NS') ? alert.name : `${alert.name}.NS`;
        
        // Use the instance 'yf' with browser-like headers
        const stockData = await yf.quote(
          ticker, 
          {}, 
          { 
            validateResult: false, 
            fetchOptions: { 
              headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' 
              } 
            } 
          }
        );

        const currentPrice = stockData.regularMarketPrice;

        if (!currentPrice) continue;

        // 2. Logic: If current price meets or exceeds target
        if (currentPrice >= alert.targetPrice) {
          console.log(`MATCH! Triggering order for ${alert.name} at ${currentPrice}`);

          // 3. Create the Automatic Order
          const autoOrder = new OrdersModel({
            user: alert.user,
            name: alert.name,
            qty: alert.qty,
            price: currentPrice,
            mode: "BUY", 
            product: alert.product || "CNC",
            isAuto: true
          });
          await autoOrder.save();

          // 4. Update Holdings/Positions
          if (alert.product === "MIS") {
            await PositionsModel.findOneAndUpdate(
              { name: alert.name, user: alert.user },
              { $inc: { qty: alert.qty }, $set: { price: currentPrice, avg: currentPrice } },
              { upsert: true }
            );
          } else {
            await HoldingsModel.findOneAndUpdate(
              { name: alert.name, user: alert.user },
              { $inc: { qty: alert.qty }, $set: { price: currentPrice, avg: currentPrice } },
              { upsert: true }
            );
          }

          // 5. Mark alert as TRIGGERED
          alert.status = "TRIGGERED";
          await alert.save();
        }
      } catch (err) {
        console.error(`Worker error for ${alert.name}:`, err.message);
      }
    }
  } catch (error) {
    console.error("Alert Worker Master Error:", error.message);
  }
};

const startAlertWorker = () => {
  checkAlerts();
  setInterval(checkAlerts, 30000); 
};

module.exports = startAlertWorker;