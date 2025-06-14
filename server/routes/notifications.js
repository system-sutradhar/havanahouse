const express = require('express');
const Notification = require('../models/notification');
const router = express.Router();

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

// Create new notification
router.post('/notifications', async (req, res) => {
  try {
    const created = await Notification.create({ message: req.body.message });
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
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
