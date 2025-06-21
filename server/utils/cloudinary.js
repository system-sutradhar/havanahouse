const cloudinary = require('cloudinary').v2;

const cloudName = process.env.cloudinary_Config_Cloud_Name || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.cloudinary_Config_api_key || process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.cloudinary_Config_api_secret || process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('Cloudinary configuration is missing. Check environment variables.');
}

module.exports = cloudinary;