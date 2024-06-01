const mongoose = require("mongoose");
const subscriberModel = require("./models/subscribers");
const data = require("./data");

// Connect to DATABASE
const db_URI = `${process.env.MONGODB_URI}`;
const DATABASE_URL =
  "mongodb+srv://moulikarmakar7596:bSco0O9cFYdi9R94@youtubesubscribers.gcl84hd.mongodb.net/subscribers";
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => {
  console.log("Database created...");
  refreshAll(); // Call refreshAll() inside the db.once callback
});

const refreshAll = async () => {
  await subscriberModel.deleteMany({});
  await subscriberModel.insertMany(data);
  console.log(`${data.length} records inserted`);
  await mongoose.disconnect();
};
