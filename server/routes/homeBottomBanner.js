const { HomeBottomBanners } = require("../models/homeBottomBanner");
const { ImageUpload } = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const cloudinary = require('../utils/cloudinary');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
    //imagesArr.push(`${Date.now()}_${file.originalname}`)
  },
});

const upload = multer({ storage: storage });

router.post(`/upload`, upload.array("images"), async (req, res) => {
  const imagesArr = [];

  try {
    for (const file of req.files || []) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };

      const result = await cloudinary.uploader.upload(file.path, options);
      imagesArr.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    let imagesUploaded = new ImageUpload({
      images: imagesArr,
    });

    imagesUploaded = await imagesUploaded.save();
    return res.status(200).json(imagesArr);
  } catch (error) {
    console.error("Image upload failed", error);
    return res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

router.get(`/`, async (req, res) => {
  try {
    const bannerList = await HomeBottomBanners.find();

    if (!bannerList) {
      res.status(500).json({ success: false });
    }

    return res.status(200).json(bannerList);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get("/:id", async (req, res) => {
  slideEditId = req.params.id;

  const slide = await HomeBottomBanners.findById(req.params.id);

  if (!slide) {
    res
      .status(500)
      .json({ message: "The Banner with the given ID was not found." });
  }
  return res.status(200).send(slide);
});

router.post("/create", async (req, res) => {
  const newEntry = new HomeBottomBanners({
    images: req.body.images || [],
    catId: req.body.catId,
    catName: req.body.catName,
    subCatId: req.body.subCatId,
    subCatName: req.body.subCatName,
  });

  if (!newEntry) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }

  const saved = await newEntry.save();
  res.status(201).json(saved);
});

router.delete("/deleteImage", async (req, res) => {
  const imgUrl = req.query.img;

  // console.log(imgUrl)

  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];

  const response = await cloudinary.uploader.destroy(
    imageName,
    (error, result) => {
      // console.log(error, res)
    }
  );

  if (response) {
    res.status(200).send(response);
  }
});

router.delete("/:id", async (req, res) => {
  const item = await HomeBottomBanners.findById(req.params.id);
  const images = item.images;

  for (img of images) {
    const imgUrl = img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    cloudinary.uploader.destroy(imageName, (error, result) => {
      // console.log(error, result);
    });
    //  console.log(imageName)
  }

  const deletedItem = await HomeBottomBanners.findByIdAndDelete(req.params.id);

  if (!deletedItem) {
    res.status(404).json({
      message: "Banner not found!",
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    message: "Banner Deleted!",
  });
});

router.put("/:id", async (req, res) => {
  try {
    const banner = await HomeBottomBanners.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const newImages = req.body.images || [];
    const oldImages = banner.images || [];

    banner.images = newImages;
    banner.catId = req.body.catId;
    banner.catName = req.body.catName;
    banner.subCatId = req.body.subCatId;
    banner.subCatName = req.body.subCatName;

    const updated = await banner.save();

    const toDelete = oldImages.filter((img) => !newImages.includes(img));
    await Promise.all(
      toDelete.map((imgUrl) => {
        const imageName = imgUrl.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(imageName);
      })
    );

    res.send(updated);
  } catch (error) {
    res.status(500).json({ message: "Item cannot be updated!", success: false });
  }
});

module.exports = router;
