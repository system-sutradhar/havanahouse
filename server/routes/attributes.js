const { Attribute } = require('../models/attribute');
const express = require('express');
const router = express.Router();

router.get('/:type', async (req, res) => {
  try {
    const list = await Attribute.find({ type: req.params.type });
    res.status(200).json(list);
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

router.post('/create', async (req, res) => {
  try {
    const item = new Attribute({ type: req.body.type, label: req.body.label });
    await item.save();
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
