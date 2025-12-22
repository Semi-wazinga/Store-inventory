const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    saleUnit: {
      type: String,
      enum: ["card", "packet", "bottle"],
      required: true,
    },
    totalPrice: { type: Number, required: true },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sale", saleSchema);
