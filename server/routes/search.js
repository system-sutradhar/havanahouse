const { Product } = require("../models/products.js");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fuse = require("fuse.js");

router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ msg: "Query is required" });

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    let results = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).lean();

    if (results.length < 5) {
      const allProducts = await Product.find({}).lean();
      const fuse = new Fuse(allProducts, {
        keys: ["name", "brand", "flavorNotes"],
        threshold: 0.4,
        includeScore: true,
      });
      results = fuse.search(q).map((r) => r.item);
    }

    if (req.query.page) {
      const totalPosts = results.length;
      const totalPages = Math.ceil(totalPosts / perPage);
      const paged = results.slice((page - 1) * perPage, page * perPage);
      return res.json({ products: paged, totalPages, page });
    }

    res.json(results.slice(0, 20));
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Simple suggestion endpoint used for autocomplete widgets
router.get("/suggest", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q) return res.json([]);

    let items = await Product.find(
      { $text: { $search: q } },
      { name: 1, images: 1, score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5)
      .lean();

    if (items.length < 5) {
      const allProducts = await Product.find({}, "name images").lean();
      const fuse = new Fuse(allProducts, { keys: ["name"], threshold: 0.4 });
      items = fuse.search(q).map((r) => r.item).slice(0, 5);
    }

    const regex = new RegExp(q, "gi");
    const mapped = items.map((it) => ({
      ...it,
      highlight: it.name.replace(regex, (m) => `<mark>${m}</mark>`),
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
