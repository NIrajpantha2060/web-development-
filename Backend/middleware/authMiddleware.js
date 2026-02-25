

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
    
    // ✅ IMPORTANT: Fetch the full user from database to get current role and suspension status
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'role', 'phone', 'isSuspended', 'suspensionReason', 'suspendedAt']
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Check if user is suspended (allow only for getting user info so they can see suspension message)
    // Allow suspension check bypass for user info endpoint so suspended users can see their status
    const isUserInfoEndpoint = req.originalUrl === '/api/user/info' && req.method === 'GET';
    
    if (user.isSuspended && !isUserInfoEndpoint) {
      return res.status(403).json({ 
        message: "Your account has been suspended",
        suspended: true,
        suspensionReason: user.suspensionReason || "Violation of terms of service",
        suspendedAt: user.suspendedAt
      });
    }

    // ✅ Attach full user info with current role to request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isSuspended: user.isSuspended,
      suspensionReason: user.suspensionReason,
      suspendedAt: user.suspendedAt
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