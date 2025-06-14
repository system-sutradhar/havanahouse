const mongoose = require('mongoose');

const homeBannerSchema = mongoose.Schema({
    images: [
        {
            type: String,
            required: true,
        },
    ],
    type: {
        type: String,
    },
    overlayText: {
        type: String,
    },
    ctaUrl: {
        type: String,
    },
    position: {
        type: String,
    },
})

homeBannerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

homeBannerSchema.set('toJSON', {
    virtuals: true,
});

exports.HomeBanner = mongoose.model('HomeBanner', homeBannerSchema);
exports.homeBannerSchema = homeBannerSchema;
