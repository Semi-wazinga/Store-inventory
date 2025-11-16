// controllers/productController.js
const Product = require("../models/product");

// === CREATE PRODUCT ===
exports.createProduct = async (req, res, next) => {
    try {
     const { name, category, quantity, price, description, image } = req.body;

     if (!name || !category || price == null)
      return res.status(400).json({ error: "Missing required fields" });


      //Check if product already exists by name (case-insensitive)
      const existingProduct = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });

     if (existingProduct) {
      // If product exists, increase the quantity instead of creating a new one
      existingProduct.quantity += Number(quantity) || 0;
      if (price) existingProduct.price = price; // optional: update price
      if (description) existingProduct.description = description;
      if (image) existingProduct.image = image;
      existingProduct.updatedAt = new Date();

      await existingProduct.save();

      return res.status(200).json({
        message: "Product restocked successfully",
        product: existingProduct,
      });
     }
     
      // creates a new product if not existing
      const product = await Product.create({
      name,
      category,
      quantity,
      price,
      description,
      image,
      createdBy: req.user._id
    });

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
