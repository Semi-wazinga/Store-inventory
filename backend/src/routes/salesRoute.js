const router = require("express").Router();
const {
  createSales,
  getAllSales,
  getMySales,
  deleteSales,
  getTodaysSales,
} = require("../controllers/salesController");
const { requireAuth, requireAdmin, requireStorekeeper} = require("../middlewares/auth");

//-- Routes --
// storekeeper can record sales
router.post('/', requireAuth, requireStorekeeper, createSales)

// anyone who log's in can view today's sale
router.get('/today', requireAuth, getTodaysSales)

// storekeeper ca view their sales
router.get('/mine', requireAuth, requireStorekeeper, getMySales)

// Admin can view all sales
router.get('/', requireAuth, requireAdmin, getAllSales)

//Admin can delete sale record
router.delete('/:id', requireAuth, requireAdmin, deleteSales)

module.exports = router
