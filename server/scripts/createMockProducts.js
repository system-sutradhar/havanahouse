const mongoose = require('mongoose');
require('dotenv/config');
const { Product } = require('../models/products');
const Category = require('../models/category');

async function run() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    const category = await Category.findOne();
    if (!category) {
      console.error('No category found');
      return;
    }
    const image = 'https://res.cloudinary.com/dvs2xu1r1/image/upload/v1744460942/1744460941314_rc_front.jpg';

    const common = {
      images: [image],
      category: category._id,
      catName: 'Cigars',
      subCatName: 'Robusto',
      productRam: ['N/A'],
      size: ['N/A'],
      productWeight: ['N/A'],
    };

    const products = [
      {
        name: 'Montecristo White Series Robusto',
        description: 'Premium mild-to-medium cigar with creamy smooth notes',
        brand: 'Montecristo',
        price: 3400,
        oldPrice: 3600,
        catId: 'CIG01',
        subCatId: 'ROB01',
        countInStock: 15,
        rating: 4.6,
        isFeatured: true,
        discount: 5,
        ringGauge: 52,
        lengthInInches: 5.5,
        binder: 'Dominican Binder',
        filler: 'Dominican Filler',
        origin: 'Dominican Republic',
        wrapperType: 'Ecuadorian Connecticut',
        strength: 'Mild to Medium',
        flavorNotes: ['Creamy', 'Smooth', 'Nutty'],
        tastingNotes: ['Vanilla', 'Cedar'],
        pairingSuggestions: ['Coffee', 'Champagne'],
        boxType: 'Box of 20',
        badgeIcons: ['handmade', 'bestseller'],
        trustLabels: ['genuine', 'premium'],
        complianceNotes: 'Follows all US cigar regulations',
      },
      {
        name: 'Padron 1926 Series No. 2 Maduro',
        description: 'Bold full-bodied cigar packed with espresso and cocoa',
        brand: 'Padron',
        price: 4100,
        oldPrice: 4300,
        catId: 'CIG01',
        subCatId: 'MAD02',
        countInStock: 8,
        rating: 4.8,
        isFeatured: true,
        discount: 6,
        ringGauge: 54,
        lengthInInches: 5.2,
        binder: 'Nicaraguan Binder',
        filler: 'Nicaraguan Filler',
        origin: 'Nicaragua',
        wrapperType: 'Maduro',
        strength: 'Full',
        flavorNotes: ['Cocoa', 'Espresso', 'Pepper'],
        tastingNotes: ['Earthy', 'Dark Chocolate'],
        pairingSuggestions: ['Dark Rum', 'Black Coffee'],
        boxType: 'Box of 24',
        badgeIcons: ['top-rated', 'limited'],
        trustLabels: ['certified'],
        complianceNotes: 'Meets premium cigar labeling norms',
      },
      {
        name: 'Arturo Fuente Hemingway Short Story',
        description: 'Medium-bodied classic with sweet spice and cedar tones',
        brand: 'Arturo Fuente',
        price: 2500,
        oldPrice: 2700,
        catId: 'CIG01',
        subCatId: 'CAM01',
        countInStock: 22,
        rating: 4.4,
        isFeatured: false,
        discount: 7,
        ringGauge: 49,
        lengthInInches: 4,
        binder: 'Cameroon Binder',
        filler: 'Dominican Long Filler',
        origin: 'Dominican Republic',
        wrapperType: 'Cameroon',
        strength: 'Medium',
        flavorNotes: ['Sweet Spice', 'Earth', 'Cedar'],
        tastingNotes: ['Cinnamon', 'Cocoa'],
        pairingSuggestions: ['Red Wine', 'Single Malt Scotch'],
        boxType: 'Box of 25',
        badgeIcons: ['classic'],
        trustLabels: ['award-winning'],
        complianceNotes: 'Labeled per FDA guidelines',
      },
    ];

    for (const data of products) {
      const p = new Product({ ...common, ...data });
      await p.save();
      console.log('Inserted product ID:', p.id);
    }
  } catch (err) {
    console.error('Error inserting products:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
