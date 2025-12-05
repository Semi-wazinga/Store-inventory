// salesController
const mongoose = require("mongoose");
const Sales = require("../models/sales");
const Product = require("../models/product");

//create sales
exports.createSales = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity)
      return res
        .status(400)
        .json({ error: "Product Name and Quantity required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ error: "Product not found" });

    // check product quntity
    if (product.quantity < quantity)
      return res.status(404).json({ error: "Not enough stock available" });

    // calculate total
    const totalPrice = product.price * quantity;

    const sale = await Sales.create({
      product: productId,
      quantity,
      totalPrice,
      soldBy: req.user.id, // specific storekeeper (use req.user.id from auth middleware)
    });

    console.log(
      "Sale created - soldBy:",
      sale.soldBy,
      "User ID:",
      req.user.id,
      "User Object:",
      req.user
    );

    // update product quantity
    product.quantity -= quantity;
    await product.save();

    res
      .status(201)
      .json({
        message: "sales succesfully recorded",
        sale,
        updatedProduct: product,
      });
  } catch (err) {
    next(err);
  }
};

// === Get all sales === (admin only)
exports.getAllSales = async (req, res, next) => {
  try {
    const sales = await Sales.find()
      .populate("product", "name price")
      .populate("soldBy", "name role");

    res.json(sales);
  } catch (err) {
    next(err);
  }
};

// === GET TODAY'S SALES ===
exports.getTodaysSales = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Admin: return all today's sales. Storekeeper: return only their sales for today.
    if (req.user && req.user.role === "admin") {
      const sales = await Sales.find({
        createdAt: { $gte: start, $lte: end },
      })
        .populate("product", "name price")
        .populate("soldBy", "name role");

      return res.status(200).json(sales);
    }

    // For storekeepers, scope to their own sales
    const userId = req.user && (req.user.id || req.user._id);

    console.log("=== getTodaysSales Debug ===");
    console.log("User ID:", userId, "Type:", typeof userId);
    console.log("User role:", req.user?.role);
    console.log("Full user object:", req.user);

    // Convert to ObjectId if it's a string
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.error("Invalid user ID format:", userId);
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const sales = await Sales.find({
      soldBy: userObjectId,
      createdAt: { $gte: start, $lte: end },
    })
      .populate("product", "name price")
      .populate("soldBy", "name role");

    console.log(
      "Query results - Found",
      sales.length,
      "sales for user",
      userObjectId
    );

    if (!sales || sales.length === 0) {
      return res.status(200).json({ message: "No sales today yet" });
    }

    return res.status(200).json(sales);
  } catch (err) {
    next(err);
  }
};

// === Get sales by storekeeper ===
exports.getMySales = async (req, res, next) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const sales = await Sales.find({ soldBy: userObjectId }).populate(
      "product",
      "name price"
    );
    res.json(sales);
  } catch (err) {
    next(err);
  }
};

// === Delete a sale (admin only) ===
exports.deleteSales = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sale = await Sales.findByIdAndDelete(id);
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    next(err);
  }
};
