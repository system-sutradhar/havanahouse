const express = require("express");
const Category = require("../models/category"); // ✅ Correct Model Import
const { ImageUpload } = require("../models/imageUpload.js");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// **Upload Images & Store in Cloudinary**
router.post(`/upload`, upload.array("images"), async (req, res) => {
  const imagesArr = [];
  try {
    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      imagesArr.push(result.secure_url);
      fs.unlinkSync(file.path); // ✅ Remove local file after upload
    }

    let imagesUploaded = new ImageUpload({ images: imagesArr });
    imagesUploaded = await imagesUploaded.save();
    return res.status(200).json(imagesArr);
  } catch (error) {
    console.log("❌ Image Upload Error:", error);
    res.status(500).json({ success: false, message: "Image upload failed." });
  }
});

// **Recursive Function to Structure Categories**
const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  const categoryItems = categories.filter(cat =>
    parentId ? cat.parentId === parentId : !cat.parentId
  );

  for (let cat of categoryItems) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      images: cat.images,
      color: cat.color,
      slug: cat.slug,
      children: createCategories(categories, cat.catId), // ✅ Using `catId` instead of `_id`
    });
  }

  return categoryList;
};

// **GET All Categories**
router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find({});
    if (!categoryList.length) {
      return res.status(404).json({ success: false, message: "No categories found." });
    }

    return res.status(200).json({
      success: true,
      categoryList: createCategories(categoryList),
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Server error while fetching categories." });
  }
});

// **GET Category Count (Top-Level Categories)**
router.get(`/get/count`, async (req, res) => {
  try {
    const categoryCount = await Category.countDocuments({ parentId: null });
    res.json({ categoryCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching category count." });
  }
});

// **GET Sub-Category Count**
router.get(`/subCat/get/count`, async (req, res) => {
  try {
    const subCategoryCount = await Category.countDocuments({ parentId: { $ne: null } });
    res.json({ subCategoryCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching subcategory count." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // ✅ Ensure `images` is always an array
    const categoryData = {
      ...category.toObject(),
      images: category.images || [], // ✅ Fix undefined images issue
    };

    res.status(200).json({ success: true, category: categoryData });
  } catch (error) {
    console.error("❌ Error fetching category:", error);
    res.status(500).json({ success: false, message: "Error fetching category." });
  }
});

// **POST Create New Category**
router.post("/create", async (req, res) => {
  try {
    const { name, color, parentId } = req.body;
    const slug = slugify(name, { lower: true });

    const newCategory = new Category({
      name,
      slug,
      color,
      parentId: parentId || null,
      images: Array.isArray(req.body.images) ? req.body.images : [],
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({ success: true, category: savedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating category." });
  }
});

// **DELETE Image from Cloudinary**
router.delete("/deleteImage", async (req, res) => {
  try {
    const imgUrl = req.query.img;
    const imageName = imgUrl.split("/").pop().split(".")[0];

    const response = await cloudinary.uploader.destroy(imageName);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting image." });
  }
});

// **DELETE Category**
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    // ✅ Delete images from Cloudinary
    for (let img of category.images) {
      const imageName = img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imageName);
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Category Deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting category." });
  }
});

// **PUT Update Category**
router.put("/:id", async (req, res) => {
  try {
    const { name, images, color } = req.body;
    const updatedImages = Array.isArray(images) ? images : [];
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        images: updatedImages,
        color,
        slug: slugify(name, { lower: true }),
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(500).json({ message: "Category cannot be updated!" });
    }

    res.json({ success: true, category: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating category." });
  }
});

module.exports = router;
