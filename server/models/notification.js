const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    image: { type: String },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

notificationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Notification', notificationSchema);
