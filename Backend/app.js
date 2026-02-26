/**
 * Express Application Configuration
 * This file contains the Express app setup and middleware configuration.
 * Separated from server.js to enable testing without starting the server.
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const userRoutes = require("./routes/userRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const rideRoutes = require("./routes/rideRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reportRoutes = require("./routes/reportRoutes");
const issueRoutes = require("./routes/issueRoutes");

// Import models
const User = require("./models/User");
const Verification = require("./models/Verification");
const Notification = require("./models/Notification");
const Ride = require("./models/Ride");
const Vehicle = require("./models/Vehicle");
const RideBooking = require("./models/RideBooking");
const Report = require("./models/Report");
const Issue = require("./models/Issue");

// Initialize all models in an object
const models = {
  User,
  Verification,
  Notification,
  Ride,
  Vehicle,
  RideBooking,
  Report,
  Issue
};

// Call associate method on each model if it exists
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads', 'profiles')));
app.use('/uploads/documents', express.static(path.join(__dirname, 'uploads', 'documents')));
app.use('/uploads/vehicles', express.static(path.join(__dirname, 'uploads', 'vehicles')));
app.use('/uploads/issues', express.static(path.join(__dirname, 'uploads', 'issues')));

// Health check route
app.get("/", (req, res) => {
  res.send("Lift Nepal Backend Running 🚗");
});

// Debug: Test file uploads
app.get("/uploads/test", (req, res) => {
  const fs = require('fs');
  const profilesPath = path.join(__dirname, 'uploads', 'profiles');
  const documentsPath = path.join(__dirname, 'uploads', 'documents');
  const vehiclesPath = path.join(__dirname, 'uploads', 'vehicles');
  
  res.json({
    profilesExists: fs.existsSync(profilesPath),
    documentsExists: fs.existsSync(documentsPath),
    vehiclesExists: fs.existsSync(vehiclesPath),
    profilesFiles: fs.existsSync(profilesPath) ? fs.readdirSync(profilesPath) : [],
    documentsFiles: fs.existsSync(documentsPath) ? fs.readdirSync(documentsPath) : [],
    vehiclesFiles: fs.existsSync(vehiclesPath) ? fs.readdirSync(vehiclesPath) : []
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/user", userRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/issues", issueRoutes);

// Database sync function (for controlled initialization)
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("✅ Database connected and models synced");
    return true;
  } catch (error) {
    console.error("❌ Database sync error:", error);
    return false;
  }
};

module.exports = { app, sequelize, initializeDatabase };
