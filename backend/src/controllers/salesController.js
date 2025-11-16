// salesController
const Sales = require('../models/sales')
const Product = require('../models/product');

//create sales
exports.createSales = async (req, res, next) => {
  try{
    const { productId, quantity } = req.body;

    if (!productId || !quantity) 
    return res.status(400).json({error: 'Product Name and Quantity required'})

    const product = await Product.findById(productId)
    if(!product) return res.status(400).json({error: 'Product not found'})

    // check product quntity
    if (product.quantity < quantity) return res.status(404).json({error: 'Not enough stock available'});

    // calculate total
    const totalPrice = product.price * quantity 

    const sale = await Sales.create({
        product: productId,
        quantity,
        totalPrice,
        soldBy: req.user._id // specific storekeeper
    })

    // update product quantity
    product.quantity -= quantity;
    await product.save()

    res.status(201).json({message: "sales succesfully recorded", 
      sale, 
      updatedProduct: product
    });
  } catch(err){
    next(err)
  }
}

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

// === GET TODAY’S SALES ===
exports.getTodaysSales = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const sales = await Sales.find({
      createdAt: { $gte: start, $lte: end },
    })
      .populate("product", "name price")
      .populate("soldBy", "name role");

    res.status(200).json(sales);
  } catch (err) {
    next(err);
  }
};

// === Get sales by storekeeper ===
exports.getMySales = async (req, res, next) => {
  try {
    const sales = await Sales.find({ soldBy: req.user._id })
      .populate("product", "name price");
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

