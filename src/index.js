require("dotenv").config({
  path: "C:\\Users\\mouli\\Desktop\\AlmaBetter JS\\Almabetter\\Get-YouTube-Subscribers\\config.env",
});
const express = require("express");
const app = require("./app.js");
const mongoose = require("mongoose");
const port = 3000;
console.log("DBURI =", process.env.DBURI);
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to DATABASE
const DATABASE_URL =
  "mongodb+srv://moulikarmakar7596:bSco0O9cFYdi9R94@youtubesubscribers.gcl84hd.mongodb.net/subscribers";
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

// Start Server
app.listen(port, () => console.log(`App listening on port ${port}!`));
