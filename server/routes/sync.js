const express = require("express");
const { syncCategoriesFromErply, syncProductsFromErply } = require("../utils/erplyService");
const router = express.Router();

router.get("/sync-categories", async (req, res) => {
    try {
        await syncCategoriesFromErply();

        // **Send JSON response instead of JavaScript**
        res.json({
            success: true,
            message: "✅ Categories Synced Successfully!",
        });
    } catch (error) {
        console.error("❌ Error syncing categories:", error);

        // **Send JSON response for error**
        res.status(500).json({
            success: false,
            message: "❌ Failed to sync categories.",
        });
    }
});

router.get("/sync-products", async (req, res) => {
    try {
        await syncProductsFromErply();
        res.json({ success: true, message: "✅ Products Synced Successfully!" });
    } catch (error) {
        console.error("❌ Error syncing products:", error);
        res.status(500).json({ success: false, message: "❌ Failed to sync products." });
    }
});

module.exports = router;
