const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  brand: { type: String, default: "" },
  price: { type: Number, default: 0 },
  oldPrice: { type: Number, default: 0 },
  catName: { type: String, default: "" },
  catId: { type: String, default: "" },
  subCatId: { type: String, default: "" },
  subCat: { type: String, default: "" },
  subCatName: { type: String, default: "" },
  slug: { type: String, unique: true, lowercase: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  discount: { type: Number, required: true },
  productRam: [{ type: String, default: null }],
  size: [{ type: String, default: null }],
  productWeight: [{ type: String, default: null }],
  ringGauge: { type: Number },
  lengthInInches: { type: Number },
  binder: { type: String, default: "" },
  filler: { type: String, default: "" },
  origin: { type: String, default: "" },
  wrapperType: { type: String, default: "" },
  strength: { type: String, default: "" },
  flavorNotes: [{ type: String, default: null }],
  tastingNotes: [{ type: String, default: null }],
  pairingSuggestions: [{ type: String, default: null }],
  boxType: { type: String, default: "" },
  badgeIcons: [{ type: String, default: null }],
  trustLabels: [{ type: String, default: null }],
  complianceNotes: { type: String, default: "" },
  dateCreated: { type: Date, default: Date.now },
});

// Create a text index for efficient search across key fields
productSchema.index({
  name: "text",
  brand: "text",
  description: "text",
  catName: "text",
  subCatName: "text",
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Products", productSchema);

// ✅ Export as object
module.exports = { Product };
