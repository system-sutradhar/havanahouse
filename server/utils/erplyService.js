require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("../models/products");
const Category = require("../models/category");

const ERPLY_API_URL = `https://${process.env.ERPLY_CLIENT_CODE}.erply.com/api/`;
const ERPLY_PIM_API_URL = process.env.ERPLY_PIM_API_URL;
const { ERPLY_CLIENT_CODE, ERPLY_USERNAME, ERPLY_PASSWORD, ERPLY_PRICE_LIST_ID } = process.env;

let sessionKey = null;

// **Authenticate and Get ERPLY Session Key**
async function authenticate() {
    console.log("🔑 Authenticating with ERPLY...");
    try {
        const response = await axios.post(ERPLY_API_URL, new URLSearchParams({
            clientCode: ERPLY_CLIENT_CODE,
            username: ERPLY_USERNAME,
            password: ERPLY_PASSWORD,
            request: "verifyUser",
        }).toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const records = response.data?.records?.[0];
        if (records?.sessionKey) {
            sessionKey = records.sessionKey;
            console.log("✅ ERPLY Session Key:", sessionKey);
        } else {
            throw new Error("Session Key Not Found");
        }
    } catch (error) {
        console.error("❌ Authentication Error:", error.message);
        throw new Error("ERPLY Authentication Failed");
    }
}

// **Ensure a valid session key before making API calls**
async function ensureSession() {
    if (!sessionKey) await authenticate();
}

async function syncCategoriesFromErply() {
    await ensureSession();

    try {
        console.log("📡 Fetching categories from ERPLY...");

        const params = new URLSearchParams({
            clientCode: ERPLY_CLIENT_CODE,  // ✅ ERPLY Client Code
            sessionKey: sessionKey,        // ✅ ERPLY Session Key
            request: "getProductGroups",   // ✅ Fetch product groups (categories)
            sendContentType: "1"           // ✅ Ensure correct content type
        });

        const response = await axios.post(ERPLY_API_URL, params.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        if (!response.data.records || response.data.status?.responseStatus !== "ok") {
            throw new Error(`❌ ERPLY getProductGroups API Error: ${JSON.stringify(response.data)}`);
        }

        const categories = response.data.records.map(cat => ({
            name: cat.name,
            slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
            catId: cat.productGroupID,  // ✅ Store ERPLY category ID
            parentId: cat.parentGroupID || null, // ✅ Handle parent-child relationships
            images: cat.images || [], // ✅ Store images if available
            color: cat.color || null, // ✅ Store color if available
        }));

        console.log(`✅ Fetched ${categories.length} categories from ERPLY`, categories);

        // ✅ Ensure `deleteMany()` works by checking if Category is correctly imported
        if (typeof Category.deleteMany !== "function") {
            throw new Error("❌ `Category.deleteMany` is not a function. Check model import.");
        }

        // ✅ Use `insertMany` instead of `bulkWrite` for better performance
        await Category.deleteMany({}); // ✅ Clear existing categories (Optional)
        await Category.insertMany(categories);

        console.log(`✅ Synced ${categories.length} categories to MongoDB`);
    } catch (error) {
        console.error("❌ Error syncing categories:", error.message);
    }
}

async function fetchProductIDsFromPriceList() {
    await ensureSession();
    
    console.log(`📡 Fetching product IDs from ERPLY price list ID: ${ERPLY_PRICE_LIST_ID}...`);

    let productIDs = [];
    let pageNo = 1;
    const recordsPerPage = 100;

    while (true) {
        try {
            const params = new URLSearchParams({
                clientCode: ERPLY_CLIENT_CODE,
                sessionKey: sessionKey,
                request: "getProductsInPriceList",
                priceListID: ERPLY_PRICE_LIST_ID,
                recordsOnPage: recordsPerPage,
                pageNo: pageNo,
            });

            const response = await axios.post(ERPLY_API_URL, params.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            if (!response.data.records || response.data.status?.responseStatus !== "ok") {
                console.log("⚠️ No more products found.");
                break;
            }

            const chunkIDs = response.data.records.map(product => product.productID);
            productIDs.push(...chunkIDs);

            console.log(`✅ Fetched ${chunkIDs.length} product IDs (Page ${pageNo})`);

            if (chunkIDs.length < recordsPerPage) {
                break;
            }

            pageNo++;
        } catch (error) {
            console.error("❌ Error fetching product IDs:", error.message);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ Total ${productIDs.length} product IDs fetched.`);
    return productIDs;
}

async function fetchProductsInBatches(productIDs, batchSize = 100) {
    await ensureSession();
    
    console.log(`📡 Fetching product details for ${productIDs.length} products in batches of ${batchSize}...`);
    
    let allProducts = [];
    for (let i = 0; i < productIDs.length; i += batchSize) {
        const batch = productIDs.slice(i, i + batchSize);
        console.log(`🔄 Processing batch ${Math.ceil(i / batchSize) + 1} with ${batch.length} products...`);

        try {
            const params = new URLSearchParams({
                clientCode: ERPLY_CLIENT_CODE,
                sessionKey: sessionKey,
                request: "getProducts",
                recordsOnPage: batch.length,
                productIDs: batch.join(","),
            });

            const response = await axios.post(ERPLY_API_URL, params.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            if (response.data.records && response.data.status?.responseStatus === "ok") {
                allProducts.push(...response.data.records);
            }
        } catch (error) {
            console.error(`❌ Error fetching batch ${Math.ceil(i / batchSize) + 1}:`, error.message);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ Fetched ${allProducts.length} total products.`);
    return allProducts;
}

async function syncProductsFromErply() {
    console.log("🔄 Starting Product Sync...");

    try {
        await ensureSession();

        const productIDs = await fetchProductIDsFromPriceList();
        if (productIDs.length === 0) {
            console.log("⚠️ No products found in price list. Aborting sync.");
            return;
        }

        await Product.deleteMany({});
        console.log("🗑️ Existing products deleted.");

        const products = await fetchProductsInBatches(productIDs);
        if (products.length === 0) {
            console.log("⚠️ No products found in ERPLY. Aborting sync.");
            return;
        }

        const formattedProducts = await Promise.all(products.map(async (product) => {
            let categoryObjectId = null;

            // ✅ Check if category exists before inserting
            if (product.groupID) {
                let category = await Category.findOne({ catId: product.groupID });

                if (!category) {
                    try {
                        category = new Category({
                            name: product.groupName || "Uncategorized",
                            slug: product.groupName?.toLowerCase().replace(/\s+/g, "-") || `uncategorized-${Date.now()}`, // ✅ Ensure unique slug
                            catId: product.groupID,
                            images: []
                        });
                        category = await category.save();
                    } catch (err) {
                        if (err.code === 11000) {
                            console.warn(`⚠️ Duplicate category slug detected for '${product.groupName}'. Using existing category.`);
                            category = await Category.findOne({ slug: product.groupName.toLowerCase().replace(/\s+/g, "-") });
                        } else {
                            console.error("❌ Error inserting category:", err);
                        }
                    }
                }

                categoryObjectId = category ? category._id : null;
            }

            return {
                name: product.name || "Unnamed Product",
                description: product.longDescription || "No description available",
                images: product.imageURLs && product.imageURLs.length > 0 ? product.imageURLs : ["https://via.placeholder.com/150"], // ✅ Default image
                brand: product.brandName || "Unknown",
                price: product.price || 0,
                oldPrice: product.previousPrice || product.price || 0,
                catName: product.groupName || "Uncategorized",
                catId: product.groupID || "",
                subCatId: "",
                subCat: "",
                subCatName: "",
                category: categoryObjectId ? new mongoose.Types.ObjectId(categoryObjectId) : null, // ✅ Ensure valid `ObjectId`
                countInStock: product.freeStock || 0,
                rating: 0,
                isFeatured: false,
                discount: 0,
                productRam: [],
                size: [],
                productWeight: [],
                location: "All",
                dateCreated: new Date(),
            };
        }));

        const batchSize = 100;
        for (let i = 0; i < formattedProducts.length; i += batchSize) {
            await Product.insertMany(formattedProducts.slice(i, i + batchSize));
            console.log(`✅ Inserted batch ${Math.ceil(i / batchSize) + 1} with ${batchSize} products.`);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`✅ Sync completed: ${formattedProducts.length} products successfully inserted.`);
    } catch (error) {
        console.error("❌ Error syncing products:", error.message);
    }
}

module.exports = { syncCategoriesFromErply, syncProductsFromErply };
