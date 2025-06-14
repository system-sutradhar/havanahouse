const mongoose = require('mongoose');

const appSettingSchema = mongoose.Schema({
  name: { type: String, required: true },
  prelogin: { type: Boolean, default: false },
  postlogin: { type: Boolean, default: false },
  desktop: { type: Boolean, default: false },
  mobile: { type: Boolean, default: false },
});

appSettingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

appSettingSchema.set('toJSON', {
  virtuals: true,
});

exports.AppSetting = mongoose.model('AppSetting', appSettingSchema);
exports.appSettingSchema = appSettingSchema;
