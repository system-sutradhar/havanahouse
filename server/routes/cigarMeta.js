const { CigarMeta } = require('../models/cigarMeta');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const filter = req.query.type ? { type: req.query.type } : {};
  try {
    const list = await CigarMeta.find(filter);
    if (!list) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json(list);
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

router.post('/create', async (req, res) => {
  try {
    let item = new CigarMeta({
      type: req.body.type,
      value: req.body.value,
    });
    item = await item.save();
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

router.put('/:id', async (req, res) => {
  const item = await CigarMeta.findByIdAndUpdate(
    req.params.id,
    {
      type: req.body.type,
      value: req.body.value,
    },
    { new: true }
  );
  if (!item) {
    return res.status(500).json({ success: false });
  }
  res.send(item);
});

router.delete('/:id', async (req, res) => {
  const deleted = await CigarMeta.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Item not found!' });
  }
  res.status(200).json({ success: true, message: 'Item Deleted!' });
});

module.exports = router;
