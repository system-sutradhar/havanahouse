const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  label: { type: String, required: true },
});

attributeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

attributeSchema.set('toJSON', { virtuals: true });

exports.Attribute = mongoose.model('Attribute', attributeSchema);
exports.attributeSchema = attributeSchema;
