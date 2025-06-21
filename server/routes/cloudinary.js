const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');

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
