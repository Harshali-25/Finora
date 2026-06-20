const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance(); 

const AlertModel = require("../model/AlertModel");
const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const sendEmail = require("../utils/sendEmail"); // Ensure this path matches your sendEmail.js location

const checkAlerts = async () => {
  try {
    console.log("Checking stock alerts...");
    
    // FETCH & POPULATE: This joins the Alert with the User to get the email address
    const activeAlerts = await AlertModel.find({ status: "ACTIVE" }).populate("user");

    for (const alert of activeAlerts) {
      try {
        const ticker = alert.name.endsWith('.NS') ? alert.name : `${alert.name}.NS`;
        
        const stockData = await yf.quote(ticker, {}, { 
          validateResult: false, 
          fetchOptions: { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' } 
          } 
        });

        const currentPrice = stockData.regularMarketPrice;
        if (!currentPrice) continue;

        // Logic: Trigger if price goes ABOVE target
        if (currentPrice >= alert.targetPrice) {
          console.log(`MATCH! Triggering order for ${alert.name} at ${currentPrice}`);

          // 1. Create the Automatic Order
          const autoOrder = new OrdersModel({
            user: alert.user._id,
            name: alert.name,
            qty: alert.qty,
            price: currentPrice,
            mode: "BUY", 
            product: alert.product || "CNC",
            isAuto: true
          });
          await autoOrder.save();

          // 2. Update Holdings or Positions
          const targetModel = alert.product === "MIS" ? PositionsModel : HoldingsModel;
          await targetModel.findOneAndUpdate(
            { name: alert.name, user: alert.user._id },
            { $inc: { qty: alert.qty }, $set: { price: currentPrice, avg: currentPrice } },
            { upsert: true }
          );

          // 3. Update status to TRIGGERED
          alert.status = "TRIGGERED";
          await alert.save();

          // 4. SEND THE EMAIL
          if (alert.user && alert.user.email) {
            const emailBody = `
              <p>Hello <strong>${alert.user.username || 'Trader'}</strong>,</p>
              <p>Your price alert for <strong>${alert.name}</strong> was triggered!</p>
              <table border="1" cellpadding="10" style="border-collapse: collapse;">
                <tr><td><strong>Stock</strong></td><td>${alert.name}</td></tr>
                <tr><td><strong>Target Price</strong></td><td>₹${alert.targetPrice}</td></tr>
                <tr><td><strong>Executed At</strong></td><td>₹${currentPrice}</td></tr>
              </table>
              <p>An automatic <strong>${alert.product}</strong> order has been placed successfully.</p>
            `;

            await sendEmail(alert.user.email, `🚨 Finora Alert: ${alert.name} Triggered`, emailBody);
            console.log(`Notification sent to: ${alert.user.email}`);
          }
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