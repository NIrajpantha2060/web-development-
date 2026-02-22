
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// require("dotenv").config();

// const sequelize = require("./config/db");

// // Import routes
// const authRoutes = require("./routes/authRoutes");
// const passwordRoutes = require("./routes/passwordRoutes");
// const userRoutes = require("./routes/userRoutes");
// const verificationRoutes = require("./routes/verificationRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const rideRoutes = require("./routes/rideRoutes"); // ✅ ADDED

// // Import models
// const User = require("./models/User");
// const Verification = require("./models/Verification");
// const Notification = require("./models/Notification");
// const Ride = require("./models/Ride"); // ✅ ADDED

// // ✅ Initialize all models in an object
// const models = {
//   User,
//   Verification,
//   Notification,
//   Ride // ✅ ADDED
// };

// // ✅ Call associate method on each model if it exists
// Object.keys(models).forEach(modelName => {
//   if (models[modelName].associate) {
//     models[modelName].associate(models);
//   }
// });

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ FIX: Serve static files - MUST be before routes
// // This serves ALL files in uploads folder and its subfolders
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ OPTIONAL: Add explicit routes for debugging (can remove later)
// app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads', 'profiles')));
// app.use('/uploads/documents', express.static(path.join(__dirname, 'uploads', 'documents')));
// app.use('/uploads/vehicles', express.static(path.join(__dirname, 'uploads', 'vehicles'))); // ✅ ADDED

// // Test route
// app.get("/", (req, res) => {
//   res.send("Lift Nepal Backend Running 🚗");
// });

// // ✅ DEBUG: Add this route to check if files exist
// app.get("/uploads/test", (req, res) => {
//   const fs = require('fs');
//   const profilesPath = path.join(__dirname, 'uploads', 'profiles');
//   const documentsPath = path.join(__dirname, 'uploads', 'documents');
//   const vehiclesPath = path.join(__dirname, 'uploads', 'vehicles'); // ✅ ADDED
  
//   res.json({
//     profilesExists: fs.existsSync(profilesPath),
//     documentsExists: fs.existsSync(documentsPath),
//     vehiclesExists: fs.existsSync(vehiclesPath), // ✅ ADDED
//     profilesFiles: fs.existsSync(profilesPath) ? fs.readdirSync(profilesPath) : [],
//     documentsFiles: fs.existsSync(documentsPath) ? fs.readdirSync(documentsPath) : [],
//     vehiclesFiles: fs.existsSync(vehiclesPath) ? fs.readdirSync(vehiclesPath) : [] // ✅ ADDED
//   });
// });

// // ✅ DEBUG: Test upload endpoint without auth to isolate issues
// app.post("/api/test-upload", (req, res, next) => {
//   console.log('\n=== TEST UPLOAD ENDPOINT ===');
//   console.log('Request headers:', req.headers);
//   console.log('Request body:', req.body);
//   console.log('Request files before middleware:', req.files);
//   next();
// }, require('./middleware/verificationUploadMiddleware'), (req, res) => {
//   console.log('Request files after middleware:', req.files ? Object.keys(req.files) : 'None');
//   if (req.files) {
//     Object.entries(req.files).forEach(([key, fileArray]) => {
//       fileArray.forEach(file => {
//         console.log(`  ${key}: ${file.filename}`);
//         const fs = require('fs');
//         const exists = fs.existsSync(file.path);
//         console.log(`    Path: ${file.path}`);
//         console.log(`    File exists on disk: ${exists ? '✅' : '❌'}`);
//       });
//     });
//   }
//   res.json({
//     message: 'Test upload received',
//     filesCount: req.files ? Object.keys(req.files).length : 0,
//     files: req.files
//   });
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/password", passwordRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/verification", verificationRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/rides", rideRoutes); // ✅ ADDED

// // Connect database and sync models
// sequelize.sync({ alter: false }).then(() => {
//   console.log("✅ Database connected and models synced");
// }).catch((error) => {
//   console.error("❌ Database sync error:", error);
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📁 Serving static files from: ${path.join(__dirname, 'uploads')}`);
// });

// module.exports = app;

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
const bookingRoutes = require("./routes/bookingRoutes"); // ✅ NEW: Booking & Payment routes

// Import models
const User = require("./models/User");
const Verification = require("./models/Verification");
const Notification = require("./models/Notification");
const Ride = require("./models/Ride");
const Vehicle = require("./models/Vehicle");
const RideBooking = require("./models/RideBooking"); // ✅ NEW: Ride bookings

// ✅ Initialize all models in an object
const models = {
  User,
  Verification,
  Notification,
  Ride,
  Vehicle,
  RideBooking // ✅ NEW: Ride bookings
};

// ✅ Call associate method on each model if it exists
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads', 'profiles')));
app.use('/uploads/documents', express.static(path.join(__dirname, 'uploads', 'documents')));
app.use('/uploads/vehicles', express.static(path.join(__dirname, 'uploads', 'vehicles')));

// Test route
app.get("/", (req, res) => {
  res.send("Lift Nepal Backend Running 🚗");
});

// ✅ DEBUG: Test upload endpoint
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/user", userRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes); // ✅ NEW: Booking & Payment routes

// Connect database and sync models
// ✅ NOTE: Use alter: false to prevent enum issues
sequelize.sync({ alter: false }).then(() => {
  console.log("✅ Database connected and models synced");
}).catch((error) => {
  console.error("❌ Database sync error:", error);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'uploads')}`);
});

module.exports = app;