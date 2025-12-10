const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { loginSchema, registerSchema } = require("../validators/authValidator");

// === Helper: Sign JWT ===
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// === Helper: Set Token Cookie ===
const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// === REGISTER ===
exports.register = async (req, res, next) => {
  try {
    // Validate request body using registerSchema
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    const { name, email, password, role } = value;

    // Only admin can register users if logged in
    if (req.user && req.user.role !== "admin") {
      return res.status(403).json({
        errors: [
          { field: "role", message: "Only admin can register new users" },
        ],
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        errors: [{ field: "email", message: "Email already exists" }],
      });
    }

    // Ensure role matches schema enum
    const validRoles = ["admin", "storekeeper"];
    const assignedRole = validRoles.includes(role) ? role : "storekeeper";

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: assignedRole,
    });

    // Generate token and set cookie
    const token = signToken(user);
    setTokenCookie(res, token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    next(err);
  }
};

// === LOGIN ===
exports.login = async (req, res, next) => {
  try {
    // Validate request body using loginSchema
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        errors: [{ field: "email", message: "Email not found" }],
      });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        errors: [{ field: "password", message: "Incorrect password" }],
      });
    }

    // Generate token and set cookie
    const token = signToken(user);
    setTokenCookie(res, token);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    next(err);
  }
};

// === LOGOUT ===
exports.logout = async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// === ME (Current Authenticated User) ===
exports.me = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
