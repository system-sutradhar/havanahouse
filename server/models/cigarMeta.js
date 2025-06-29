const mongoose = require('mongoose');

const cigarMetaSchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: String, required: true },
});

cigarMetaSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

cigarMetaSchema.set('toJSON', { virtuals: true });

exports.CigarMeta = mongoose.model('CigarMeta', cigarMetaSchema);
exports.cigarMetaSchema = cigarMetaSchema;
