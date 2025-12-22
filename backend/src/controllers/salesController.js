const Sales = require("../models/sales");
const Product = require("../models/product");

// ============================
// CREATE SALE
// ============================
exports.createSales = async (req, res, next) => {
  try {
    const { productId, quantity, saleUnit } = req.body;

    // ---------------------------
    // VALIDATION
    // ---------------------------
    if (!productId || !quantity || !saleUnit) {
      return res
        .status(400)
        .json({ error: "Product, quantity, and sale unit are required" });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity must be a positive number" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let unitPrice = 0;

    // ============================
    // PACKET SALE
    // ============================
    if (saleUnit === "packet") {
      if (product.stockType !== "packet") {
        return res
          .status(400)
          .json({ error: "This product is not sold in packets" });
      }

      if (product.stockQuantity < qty) {
        return res.status(400).json({ error: "Not enough packets in stock" });
      }

      if (typeof product.pricePerPacket !== "number") {
        return res.status(400).json({ error: "Packet price not set" });
      }

      unitPrice = product.pricePerPacket;

      // ✅ subtract PACKETS
      product.stockQuantity -= qty;
    }

    // ============================
    // CARD SALE (FROM PACKETS)
    // ============================
    else if (saleUnit === "card") {
      if (product.stockType !== "packet") {
        return res
          .status(400)
          .json({ error: "Only packet products can be sold as cards" });
      }

      const totalCardsAvailable =
        product.stockQuantity * product.cardsPerPacket;

      if (totalCardsAvailable < qty) {
        return res.status(400).json({ error: "Not enough cards in stock" });
      }

      if (typeof product.pricePerCard !== "number") {
        return res.status(400).json({ error: "Card price not set" });
      }

      unitPrice = product.pricePerCard;

      // ✅ convert cards → packets
      const packetsToRemove = qty / product.cardsPerPacket;

      product.stockQuantity -= packetsToRemove;
    }

    // ============================
    // BOTTLE SALE
    // ============================
    else if (saleUnit === "bottle") {
      if (product.stockType !== "bottle") {
        return res
          .status(400)
          .json({ error: "This product is not sold in bottles" });
      }

      if (product.stockQuantity < qty) {
        return res.status(400).json({ error: "Not enough bottles in stock" });
      }

      if (typeof product.pricePerBottle !== "number") {
        return res.status(400).json({ error: "Bottle price not set" });
      }

      unitPrice = product.pricePerBottle;

      // ✅ subtract BOTTLES
      product.stockQuantity -= qty;
    }

    // ============================
    // INVALID SALE UNIT
    // ============================
    else {
      return res.status(400).json({ error: "Invalid sale unit" });
    }

    const totalPrice = unitPrice * qty;

    // ---------------------------
    // SAVE
    // ---------------------------
    const sale = await Sales.create({
      product: productId,
      quantity: qty,
      saleUnit,
      unitPrice,
      totalPrice,
      soldBy: req.user?._id || null,
    });

    await product.save();

    res.status(201).json({
      message: "Sale recorded successfully",
      sale,
      updatedProduct: product,
    });
  } catch (err) {
    next(err);
  }
};

// ============================
// GET ALL SALES
// ============================
exports.getAllSales = async (req, res, next) => {
  try {
    const sales = await Sales.find()
      .populate(
        "product",
        "name category stockType cardsPerPacket pricePerCard pricePerPacket pricePerBottle"
      )
      .populate("soldBy", "name role")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (err) {
    next(err);
  }
};

// ============================
// GET TODAY'S SALES
// ============================
exports.getTodaysSales = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const filter = { createdAt: { $gte: start, $lte: end } };

    if (req.user?.role !== "admin") {
      filter.soldBy = req.user._id;
    }

    const sales = await Sales.find(filter)
      .populate(
        "product",
        "name category stockType cardsPerPacket pricePerCard pricePerPacket pricePerBottle"
      )
      .populate("soldBy", "name role");

    res.json(sales);
  } catch (err) {
    next(err);
  }
};

// ============================
// GET MY SALES
// ============================
exports.getMySales = async (req, res, next) => {
  try {
    const sales = await Sales.find({ soldBy: req.user._id })
      .populate(
        "product",
        "name category stockType cardsPerPacket pricePerCard pricePerPacket pricePerBottle"
      )
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (err) {
    next(err);
  }
};

// ============================
// DELETE SALE (RESTORE STOCK)
// ============================
exports.deleteSales = async (req, res, next) => {
  try {
    const sale = await Sales.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    const product = await Product.findById(sale.product);
    if (product) {
      if (sale.saleUnit === "packet") {
        product.stockQuantity += sale.quantity;
      }

      if (sale.saleUnit === "card") {
        product.stockQuantity += sale.quantity / product.cardsPerPacket;
      }

      if (sale.saleUnit === "bottle") {
        product.stockQuantity += sale.quantity;
      }

      await product.save();
    }

    await sale.deleteOne();

    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    next(err);
  }
};
