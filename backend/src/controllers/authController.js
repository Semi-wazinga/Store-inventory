const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true only for HTTPS
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// === REGISTER ===
// (Only admin can register other users)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    // If a logged-in user exists and isn’t admin, deny registration
    if (req.user && req.user.role !== "admin")
      return res.status(403).json({ error: "Only admin can register new users" });

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email already exists" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role === "admin" ? "admin" : "storekeeper",
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
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing email or password" });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

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
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// === ME (Current Authenticated User) ===
exports.me = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ error: "Not authenticated" });

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};












// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const User = require('../models/user')

// //  Sign JWT Token 
// const signToken = (user) => {
//   return jwt.sign(
//     { id: user._id, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };

// // === Helper: Set Cookie ===
// const setTokenCookie = (res, token) => {
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // true for HTTPS
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });
// };

// // === REGISTER ===
// exports.register = async (req, res, next) => {
//   try {
//     const { name, email, password, role } = req.body;
//     if (!name || !email || !password)
//       return res.status(400).json({ error: "Missing fields" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(409).json({ error: "Email already exists" });

//     const passwordHash = await bcrypt.hash(password, 12);
//     const user = await User.create({
//       name,
//       email,
//       passwordHash,
//       role: role || "customer",
//     });

//     const token = signToken(user);
//     setTokenCookie(res, token);

//     res.status(201).json({
//       message: "Registration successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (err) {
//     console.error("Register Error:", err.message);
//     next(err);
//   }
// };

// // LOGIN 
// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ error: "Missing email or password" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ error: "Invalid credentials" });

//     const match = await bcrypt.compare(password, user.passwordHash);
//     if (!match) return res.status(401).json({ error: "Invalid credentials" });

//     const token = signToken(user);
//     setTokenCookie(res, token);

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (err) {
//     console.error("Login Error:", err.message);
//     next(err);
//   }
// };

// // LOGOUT
// exports.logout = async (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });
//   res.status(200).json({ message: "Logged out successfully" });
// };

// // === ME (Current Authenticated User) ===
// exports.me = async (req, res) => {
//   if (!req.user)
//     return res.status(401).json({ error: "Not authenticated" });

//   res.json({
//     user: {
//       id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       role: req.user.role,
//     },
//   });
// };