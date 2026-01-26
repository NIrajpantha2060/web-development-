// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
  
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user info to request
//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Token expired, please login again" });
//     }
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = verifyToken;


const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ Import User model

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ IMPORTANT: Fetch the full user from database to get current role
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'role', 'phone']
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Attach full user info with current role to request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone
    };

    console.log("✅ Authenticated user:", req.user); // Debug log
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error.message); // Debug log
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;