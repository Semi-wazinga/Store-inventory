const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    stockType: {
      type: String,
      enum: ["card", "packet", "bottle"],
      required: true,
    },
    stockQuantity: { type: Number, required: true, min: 0 },

    // Only required for packets
    cardsPerPacket: {
      type: Number,
      required: function () {
        return this.stockType === "packet";
      },
    },
    pricePerPacket: {
      type: Number,
      required: function () {
        return this.stockType === "packet";
      },
    },

    pricePerCard: { type: Number, required: true, min: 0 },
    pricePerBottle: {
      type: Number,
      required: function () {
        return this.stockType === "bottle";
      },
      min: 0,
    },

    category: { type: String, required: true },
    description: { type: String, maxlength: 300 },
    image: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
