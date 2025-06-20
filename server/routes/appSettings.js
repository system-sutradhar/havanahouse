const express = require('express');
const router = express.Router();
const { AppSetting } = require('../models/appSetting');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const list = await AppSetting.find();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single setting
router.get('/:id', async (req, res) => {
  try {
    const item = await AppSetting.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Setting not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create
router.post('/create', async (req, res) => {
  try {
    let appSetting = new AppSetting({
      name: req.body.name,
      value: req.body.value,
      prelogin: req.body.prelogin,
      postlogin: req.body.postlogin,
      desktop: req.body.desktop,
      mobile: req.body.mobile,
    });
    appSetting = await appSetting.save();
    res.status(201).json(appSetting);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const setting = await AppSetting.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        value: req.body.value,
        prelogin: req.body.prelogin,
        postlogin: req.body.postlogin,
        desktop: req.body.desktop,
        mobile: req.body.mobile,
      },
      { new: true }
    );
    res.status(200).json(setting);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await AppSetting.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Setting deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
