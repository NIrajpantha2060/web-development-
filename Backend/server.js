


// const express = require("express");
// const cors = require("cors");
// const userRoutes = require("./routes/userRoutes");
// require("dotenv").config();

// const sequelize = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const passwordRoutes = require("./routes/passwordRoutes"); // ADD THIS

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test route
// app.get("/", (req, res) => {
//   res.send("Lift Nepal Backend Running 🚗");
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/password", passwordRoutes); // ADD THIS
// app.use("/api/user", userRoutes);

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
const path = require("path");  // ✅ ADD
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files (profile pictures)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get("/", (req, res) => {
  res.send("Lift Nepal Backend Running 🚗");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/user", userRoutes);

// Connect database
sequelize.sync().then(() => {
  console.log("✅ Database connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});