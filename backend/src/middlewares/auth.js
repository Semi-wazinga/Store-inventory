const jwt = require("jsonwebtoken");
const User = require("../models/user");

// === Verify JWT and attach user to req.user ===
const requireAuth = async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ") &&
      req.headers.authorization.split(" ")[1]);

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: fetch user from DB (for freshest role info)
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user)
      return res.status(401).json({ error: "User not found or no longer exists" });

    // Attach user payload to request
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Admi-only access
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
};

// Storekeeper-only access
const requireStorekeeper = (req, res, next) => {
  if (req.user.role !== "storekeeper")
    return res.status(403).json({ error: "Storekeepers only" });
  next();
};

module.exports = { requireAuth, requireAdmin, requireStorekeeper};
