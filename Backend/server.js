
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const sequelize = require("./config/db");
// const authRoutes = require("./routes/authRoutes"); // <-- ADD THIS

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json()); // <-- MUST be BEFORE routes

// // Test route
// app.get("/", (req, res) => {
//   res.send("Lift Nepal Backend Running 🚗");
// });

// // ===== Add this line to mount the signup/login routes =====
// app.use("/api/auth", authRoutes);

// // Connect database
// sequelize.sync().then(() => {
//   console.log("✅ Database connected");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes"); // ADD THIS

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Lift Nepal Backend Running 🚗");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes); // ADD THIS

// Connect database
sequelize.sync().then(() => {
  console.log("✅ Database connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});