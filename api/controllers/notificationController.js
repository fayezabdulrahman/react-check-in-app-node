const webpush = require("web-push");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
require("dotenv").config();

// Configure once
webpush.setVapidDetails(
  "mailto:fayez.rahman2@hotmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Send to ALL stored subscriptions
const sendToAll = async (req, res) => {
  const { title, message } = req.body;

  try {
    const allSubscriptions = await Subscription.find();
    const notificationPayload = {
      title,
      body: message,
      icon: "/b2b.png",
      badge: "/b2b.png",
      data: { url: "/home" },
      actions: [
        { action: "view", title: "View" },
        { action: "dismiss", title: "Dismiss" },
      ],
      vibrate: [200, 100, 200],
      tag: "new-checkin",
      renotify: true,
      silent: false,
      timestamp: Date.now(),
    };

    const sendPromises = allSubscriptions.map((sub) =>
      webpush
        .sendNotification(sub, JSON.stringify(notificationPayload))
        .catch((err) => {
          if (err.statusCode === 410) {
            console.log("Removing expired subscription:", sub.endpoint);
            return Subscription.deleteOne({ endpoint: sub.endpoint });
          }
          console.error("Notification failed:", err);
          return null;
        })
    );

    await Promise.all(sendPromises);
    res.status(200).json({ message: "Notifications sent successfully" });
  } catch (e) {
    console.error("Notification send error:", e);
    res.status(500).json({ error: "Failed to send notifications" });
  }
};

// Save new unique user subscription (browser keys)
const saveSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    const userInRequest = req.user;

    console.log("userInRequest", userInRequest);

    // Simple validation
    if (!subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription data" });
    }

    // Check if subscription already exists for this user
    const existingSub = await Subscription.findOne({
      endpoint: subscription.endpoint,
      user: userInRequest,
    });

    if (existingSub) {
      return res.status(200).json({ message: "Subscription already exists" });
    }

    // Save new subscription
    const sub = new Subscription({
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      user: userInRequest,
    });

    await sub.save();

    res.status(201).json({ message: "Subscription saved successfully" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const { endpoint } = req.body;
    console.log("endpoint", endpoint);
    await Subscription.deleteOne({ endpoint });
    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
};

module.exports = { sendToAll, saveSubscription, deleteSubscription };
