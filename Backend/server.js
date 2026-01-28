



// const express = require("express");
// const cors = require("cors");
// const path = require("path");  // ✅ ADD
// const userRoutes = require("./routes/userRoutes");
// require("dotenv").config();

// const sequelize = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const passwordRoutes = require("./routes/passwordRoutes");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Serve static files (profile pictures)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Test route
// app.get("/", (req, res) => {
//   res.send("Lift Nepal Backend Running 🚗");
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/password", passwordRoutes);
// app.use("/api/user", userRoutes);

// // Connect database
// sequelize.sync().then(() => {
//   console.log("✅ Database connected");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



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

// // Import models to set up associations
// const User = require("./models/User");
// const Verification = require("./models/verification");
// const Notification = require("./models/Notification");

// // Set up associations
// Verification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// User.hasMany(Verification, { foreignKey: 'userId' });

// Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// User.hasMany(Notification, { foreignKey: 'userId' });

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Test route
// app.get("/", (req, res) => {
//   res.send("Lift Nepal Backend Running 🚗");
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/password", passwordRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/verification", verificationRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/admin", adminRoutes);

// // Connect database and sync models
// sequelize.sync().then(() => {
//   console.log("✅ Database connected and models synced");
// }).catch((error) => {
//   console.error("❌ Database sync error:", error);
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



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

// Import models
const User = require("./models/User");
const Verification = require("./models/verification");
const Notification = require("./models/Notification");

// ✅ Initialize all models in an object
const models = {
  User,
  Verification,
  Notification
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

// ✅ FIX: Serve static files - MUST be before routes
// This serves ALL files in uploads folder and its subfolders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ OPTIONAL: Add explicit routes for debugging (can remove later)
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads', 'profiles')));
app.use('/uploads/documents', express.static(path.join(__dirname, 'uploads', 'documents')));

// Test route
app.get("/", (req, res) => {
  res.send("Lift Nepal Backend Running 🚗");
});

// ✅ DEBUG: Add this route to check if files exist
app.get("/uploads/test", (req, res) => {
  const fs = require('fs');
  const profilesPath = path.join(__dirname, 'uploads', 'profiles');
  const documentsPath = path.join(__dirname, 'uploads', 'documents');
  
  res.json({
    profilesExists: fs.existsSync(profilesPath),
    documentsExists: fs.existsSync(documentsPath),
    profilesFiles: fs.existsSync(profilesPath) ? fs.readdirSync(profilesPath) : [],
    documentsFiles: fs.existsSync(documentsPath) ? fs.readdirSync(documentsPath) : []
  });
});

// ✅ DEBUG: Test upload endpoint without auth to isolate issues
app.post("/api/test-upload", (req, res, next) => {
  console.log('\n=== TEST UPLOAD ENDPOINT ===');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request files before middleware:', req.files);
  next();
}, require('./middleware/verificationUploadMiddleware'), (req, res) => {
  console.log('Request files after middleware:', req.files ? Object.keys(req.files) : 'None');
  if (req.files) {
    Object.entries(req.files).forEach(([key, fileArray]) => {
      fileArray.forEach(file => {
        console.log(`  ${key}: ${file.filename}`);
        const fs = require('fs');
        const exists = fs.existsSync(file.path);
        console.log(`    Path: ${file.path}`);
        console.log(`    File exists on disk: ${exists ? '✅' : '❌'}`);
      });
    });
  }
  res.json({
    message: 'Test upload received',
    filesCount: req.files ? Object.keys(req.files).length : 0,
    files: req.files
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/user", userRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Connect database and sync models
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