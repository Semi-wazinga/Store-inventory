// routes/productRoute.js
const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { requireAuth, requireAdmin} = require("../middlewares/auth");

// === Routes ===

// Only Admin can add products
router.post("/", requireAuth, requireAdmin, createProduct);

// Everyone logged in (admin or storekeeper) can view
router.get("/", requireAuth, getProducts);
router.get("/:id", requireAuth, getProductById);

// Only admin can update or delete
router.put("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

module.exports = router;
