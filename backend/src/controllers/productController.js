// controllers/productController.js
const Product = require("../models/product");

// === CREATE PRODUCT ===
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      stockType,
      stockQuantity,
      cardsPerPacket,
      pricePerPacket,
      pricePerCard,
      pricePerBottle,
      description,
      image,
    } = req.body;

    // Validate required fields common to all types
    if (!name || !category || !stockType || stockQuantity == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Type-specific validations
    if (stockType === "packet") {
      if (!cardsPerPacket || pricePerPacket == null || pricePerCard == null) {
        return res.status(400).json({
          error:
            "Packet products require cardsPerPacket, pricePerPacket, and pricePerCard",
        });
      }
      if (cardsPerPacket < 1) {
        return res
          .status(400)
          .json({ error: "Cards per packet must be at least 1" });
      }
    } else if (stockType === "bottle") {
      if (pricePerBottle == null) {
        return res.status(400).json({
          error: "Bottle products require pricePerBottle",
        });
      }
    }

    // Check if product already exists by name (case-insensitive)
    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingProduct) {
      // Restock existing product
      existingProduct.stockQuantity += stockQuantity;

      if (stockType === "packet") {
        existingProduct.cardsPerPacket = cardsPerPacket;
        existingProduct.pricePerPacket = pricePerPacket;
        existingProduct.pricePerCard = pricePerCard;
      } else if (stockType === "bottle") {
        existingProduct.pricePerBottle = pricePerBottle;
      }

      if (description) existingProduct.description = description;
      if (image) existingProduct.image = image;
      existingProduct.updatedAt = new Date();

      await existingProduct.save();

      return res.status(200).json({
        message: "Product restocked successfully",
        product: existingProduct,
      });
    }

    // Create new product
    const productData = {
      name,
      category,
      stockType,
      stockQuantity,
      description,
      image,
      createdBy: req.user._id,
    };

    // Add type-specific fields
    if (stockType === "packet") {
      productData.cardsPerPacket = cardsPerPacket;
      productData.pricePerPacket = pricePerPacket;
      productData.pricePerCard = pricePerCard;
    } else if (stockType === "bottle") {
      productData.pricePerBottle = pricePerBottle;
      productData.pricePerCard = 0; // default for bottles
    }

    const product = await Product.create(productData);

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    next(err);
  }
};

// === GET ALL PRODUCTS ===
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("createdBy", "name role");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// === GET SINGLE PRODUCT ===
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// === UPDATE PRODUCT ===
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product updated", product });
  } catch (err) {
    next(err);
  }
};

// === DELETE PRODUCT ===
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
