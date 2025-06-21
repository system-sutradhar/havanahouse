const express = require('express');
const Notification = require('../models/notification');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Get currently published notification
router.get('/notification', async (req, res) => {
  try {
    const current = await Notification.findOne({ isPublished: true, isDeleted: false });
    res.json({ message: current ? current.message : '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load notification' });
  }
});

// List all notifications (admin)
router.get('/notifications', async (req, res) => {
  try {
    const list = await Notification.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Upload notification image
router.post('/notifications/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Image upload failed', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// Create new notification
router.post('/notifications', async (req, res) => {
  try {
    const created = await Notification.create({
      message: req.body.message,
      image: req.body.image,
    });
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Edit notification
router.put('/notifications/:id', async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { message: req.body.message, image: req.body.image },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Publish a notification (unpublish others)
router.put('/notifications/:id/publish', async (req, res) => {
  try {
    await Notification.updateMany({}, { isPublished: false });
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: 'Publish failed' });
  }
});

// Unpublish a notification
router.put('/notifications/:id/unpublish', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: 'Unpublish failed' });
  }
});

// Soft delete
router.delete('/notifications/:id', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, isPublished: false },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
