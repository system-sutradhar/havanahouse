const { Product } = require("../models/products.js");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const query = req.query.q;

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    var totalPosts = [];
    var totalPages = 0;

    if (!query) {
      return res.status(400).json({ msg: "Query is required" });
    }

    if (req.query.page && req.query.perPage) {
      const items = await Product.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate("category");

      totalPosts = await Product.countDocuments({ $text: { $search: query } });
      totalPages = Math.ceil(totalPosts / perPage);

      return res.status(200).json({
          products: items,
          totalPages,
          page,
        });
    } else {
      const items = await Product.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .limit(50);
      res.json(items);
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Simple suggestion endpoint used for autocomplete widgets
router.get("/suggest", async (req, res) => {
  try {
    const query = req.query.q || "";
    if (!query) return res.json([]);

    const items = await Product.find(
      { $text: { $search: query } },
      { name: 1, score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5);

    res.json(items.map((p) => p.name));
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
