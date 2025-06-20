const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

router.post('/delete', async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ message: 'publicId required' });
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
