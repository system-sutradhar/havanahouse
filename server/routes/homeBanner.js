const { HomeBanner } = require('../models/homeBanner');
const { ImageUpload } = require('../models/imageUpload');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const cloudinary = require('../utils/cloudinary');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
        //imagesArr.push(`${Date.now()}_${file.originalname}`)

    },
})


const upload = multer({ storage: storage })

router.post(`/upload`, upload.array("images"), async (req, res) => {
    const imagesArr = [];

    try {
        for (const file of req.files || []) {
            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            const result = await cloudinary.uploader.upload(
                file.path,
                { ...options, resource_type: 'auto' }
            );

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
      
        const bannerImagesList = await HomeBanner.find();


        if (!bannerImagesList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json(bannerImagesList);

    } catch (error) {
        res.status(500).json({ success: false })
    }


});



router.get('/:id', async (req, res) => {
    slideEditId = req.params.id;

    const slide = await HomeBanner.findById(req.params.id);

    if (!slide) {
        res.status(500).json({ message: 'The slide with the given ID was not found.' })
    }
    return res.status(200).send(slide);
})



router.post('/create', async (req, res) => {
    const newEntry = new HomeBanner({
        images: req.body.images || [],
        type: req.body.type,
        overlayText: req.body.overlayText,
        ctaUrl: req.body.ctaUrl,
        position: req.body.position,
    });



    if (!newEntry) {
        res.status(500).json({
            error: err,
            success: false
        })
    }


    const saved = await newEntry.save();
    res.status(201).json(saved);

});


router.delete('/deleteImage', async (req, res) => {
    const imgUrl = req.query.img;

   // console.log(imgUrl)

    const urlArr = imgUrl.split('/');
    const image =  urlArr[urlArr.length-1];
  
    const imageName = image.split('.')[0];

    const response = await cloudinary.uploader.destroy(imageName, (error,result)=>{
       // console.log(error, res)
    })

    if(response){
        res.status(200).send(response);
    }
      
});

router.delete('/:id', async (req, res) => {

    const item = await HomeBanner.findById(req.params.id);
    const images = item.images || [];

    for (const imgUrl of images) {
        const urlArr = imgUrl.split('/');
        const image = urlArr[urlArr.length - 1];

        const imageName = image.split('.')[0];

        cloudinary.uploader.destroy(imageName, (error, result) => {
            // console.log(error, result);
        })
    }


    const deletedItem = await HomeBanner.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            message: 'Slide not found!',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Slide Deleted!'
    })
});



router.put('/:id', async (req, res) => {
    try {
        const banner = await HomeBanner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Slide not found!' });
        }

        const newImages = req.body.images || [];
        const oldImages = banner.images || [];

        banner.images = newImages;
        banner.type = req.body.type;
        banner.overlayText = req.body.overlayText;
        banner.ctaUrl = req.body.ctaUrl;
        banner.position = req.body.position;

        const updated = await banner.save();

        const toDelete = oldImages.filter(img => !newImages.includes(img));
        await Promise.all(
            toDelete.map(imgUrl => {
                const imageName = imgUrl.split('/').pop().split('.')[0];
                return cloudinary.uploader.destroy(imageName);
            })
        );

        res.send(updated);
    } catch (error) {
        res.status(500).json({ message: 'Item cannot be updated!', success: false });
    }
})




module.exports = router;

