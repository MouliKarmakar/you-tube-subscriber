// require("dotenv").config({ path: "../config.env" });
const express = require("express");
const path = require("path");
const app = express();
const subscriberModel = require("./models/subscribers");
const staticPath = path.join(__dirname, "../public");

// Middleware to parse JSON bodies
app.use(express.json());

// Serving static files
app.get("/", express.static(staticPath));

// POST endpoint to create a new subscriber
app.post("/api/subscribers", async (req, res) => {
  try {
    const { name, subscribedChannel, subscribedDate } = req.body;
    const newSubscriber = new subscriberModel({
      name,
      subscribedChannel,
      subscribedDate,
    });
    await newSubscriber.save();
    res.status(201).json({
      message: "Subscriber created successfully",
      data: newSubscriber,
    });
  } catch (error) {
    console.error("Error creating subscriber:", error);
    res.status(500).json({ error: "Failed to create subscriber" });
  }
});

// GET endpoint to fetch all subscribers
app.get("/api/subscribers", async (req, res) => {
  try {
    const subs = await subscriberModel.find();
    res.status(200).json(subs);
  } catch (error) {
    res.status(400).json({
      error: "Bad Request",
    });
  }
});

// GET endpoint to fetch subscriber names and channels
app.get("/api/subscribers/names", async (req, res) => {
  try {
    const subs = await subscriberModel.find(
      {},
      { _id: 0, name: 1, subscribedChannel: 1 }
    );
    res.status(200).json(subs);
  } catch (error) {
    res.status(400).json({
      error: "Bad Request",
    });
  }
});

// GET endpoint to fetch subscriber by ID
app.get("/api/subscribers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const subs = await subscriberModel.findById(id);
    res.status(200).json(subs);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = app;
