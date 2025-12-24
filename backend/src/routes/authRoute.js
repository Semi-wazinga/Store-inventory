const router = require("express").Router();
const {
  register,
  login,
  logout,
  me,
} = require("../controllers/authController");
const {
  requireAuth,
  requireAdmin,
  requireStorekeeper,
} = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const rateLimiter = require("../middlewares/rateLimiter");

// Public
// Apply rate limiting to registration/login to mitigate brute-force
router.post("/register", rateLimiter, validate(registerSchema), register); // you can later restrict this to admin only
router.post("/login", rateLimiter, validate(loginSchema), login);

// Protected
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

// Example restricted routes
router.get("/admin", requireAuth, requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

router.get("/store", requireAuth, requireStorekeeper, (req, res) => {
  res.json({ message: "Welcome Storekeeper", user: req.user });
});

module.exports = router;
