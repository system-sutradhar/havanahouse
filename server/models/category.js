const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    catId: { type: Number, required: true, unique: true }, // ✅ Ensure ERPLY Category ID is stored
    images: [{ type: String }],
    color: { type: String },
    parentId: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

categorySchema.virtual("id").get(function () {
    return this._id.toHexString();
});

categorySchema.set("toJSON", { virtuals: true });

// ✅ Ensure Correct Model Export
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;