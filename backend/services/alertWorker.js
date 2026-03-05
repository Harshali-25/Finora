const cron = require("node-cron");
const Alert = require("../model/AlertModel"); // You'll need to create the Model from the Schema
const User = require("../model/UserModel");
const sendEmail = require("../utils/sendEmail");

// Mock function: In a real app, fetch live prices from an API (like Kite or AlphaVantage)
const getLivePrice = async (symbol) => {
  // Simulating price fetch. For now, we'll return a random price near 2000
  return Math.random() * (2100 - 1900) + 1900;
};

const startAlertWorker = () => {
  // Runs every 1 minute
  cron.schedule("* * * * *", async () => {
    console.log("Checking stock alerts...");

    try {
      const activeAlerts = await Alert.find({ isActive: true }).populate("user");

      for (const alert of activeAlerts) {
        const currentPrice = await getLivePrice(alert.name);

        const isHit = 
          (alert.condition === "ABOVE" && currentPrice >= alert.targetPrice) ||
          (alert.condition === "BELOW" && currentPrice <= alert.targetPrice);

        if (isHit) {
          const emailBody = `
            <p>Your alert for <b>${alert.name}</b> has been triggered!</p>
            <p>Target Price: ₹${alert.targetPrice}</p>
            <p>Current Market Price: <b>₹${currentPrice.toFixed(2)}</b></p>
            <a href="http://localhost:3000/orders" style="display:inline-block; padding:10px 20px; background:#2563eb; color:#fff; text-decoration:none;">Execute Trade</a>
          `;

          await sendEmail(alert.user.email, `🚨 Price Alert: ${alert.name}`, emailBody);
          
          // Deactivate alert so it doesn't spam every minute
          alert.isActive = false;
          await alert.save();
          console.log(`✅ Alert triggered and email sent for ${alert.name}`);
        }
      }
    } catch (error) {
      console.error("Alert Worker Error:", error);
    }
  });
};

module.exports = startAlertWorker;