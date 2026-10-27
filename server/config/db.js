const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

let isMongoConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hotel";
  try {
    // Attempt connecting to MongoDB with a short timeout
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log("MongoDB connected successfully at " + mongoUri);
  } catch (err) {
    console.log("MongoDB is not available locally (" + err.message + ").");
    console.log("HotelPro Embedded High-Performance Storage Engine activated.");
    isMongoConnected = false;
  }
};

const getStatus = () => isMongoConnected;

module.exports = { connectDB, getStatus };
