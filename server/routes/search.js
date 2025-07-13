const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fuse = require("fuse.js");

// --- THIS IS THE FIX ---
// We now destructure the import to get the 'Product' model directly from the exported object.
const { Product } = require('../models/products'); 
// The Category model is exported directly, so its import remains the same.
const Category = require('../models/category'); 

// This route handles the main search page (e.g., when a user presses Enter)
router.get("/", async (req, res) => {
  try {
    const { q, page = 1, perPage = 20 } = req.query;
    if (!q) {
      return res.status(400).json({ msg: "Search query is required" });
    }

    // Attempt to use the text index for an initial, efficient search
    let results = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).lean();

    // Fallback to Fuse.js for a broader, "fuzzy" search if text index yields few results
    if (results.length < 5) {
      const allProducts = await Product.find({}).lean();
      const fuse = new Fuse(allProducts, {
        keys: ["name", "brand", "flavorNotes", "origin"],
        threshold: 0.4,
        includeScore: true,
      });
      results = fuse.search(q).map((r) => r.item);
    }
    
    // Pagination Logic
    const totalProducts = results.length;
    const totalPages = Math.ceil(totalProducts / perPage);
    const pagedResults = results.slice((page - 1) * perPage, page * perPage);
    
    // Send the structured response the frontend expects
    res.json({
        products: pagedResults,
        totalPages,
        currentPage: page,
        totalProducts,
    });

  } catch (err) {
    console.error("Main Search API Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});


// This route handles the live search suggestions dropdown
router.get('/suggest', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || query.length < 3) {
            return res.json([]);
        }

        const regex = new RegExp(query, 'i');

        // These queries now correctly use the 'Product' and 'Category' models.
        const [productResults, categoryResults] = await Promise.all([
            Product.find({ 
                $or: [
                    { name: regex }, 
                    { brand: regex },
                    { origin: regex }
                ]
            }).limit(5).lean(),
            
            Category.find({ name: regex }).limit(3).lean()
        ]);

        const productsWithType = productResults.map(p => ({ ...p, type: 'product' }));
        const categoriesWithType = categoryResults.map(c => ({ ...c, type: 'category' }));

        const combinedResults = [...productsWithType, ...categoriesWithType];
        
        res.json(combinedResults);

    } catch (err) {
        console.error('Search Suggestion API Error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;