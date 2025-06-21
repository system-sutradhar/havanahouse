const mongoose = require('mongoose');
require('dotenv/config');
const { Product } = require('./models/products');

async function run() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);

    const update = {
      name: "Oliva Serie V Melanio Torpedo – Box of 10",
      slug: "oliva-serie-v-melanio-box-of-10",
      description: "Award-winning Nicaraguan cigar with a full-bodied profile and Sumatra-seed wrapper. Known for its chocolate, coffee, and spice notes, this cigar is beloved by aficionados.",
      price: 180,
      discount: 10,
      countInStock: 12,
      origin: "Nicaragua",
      wrapperType: "Sumatra",
      strength: "Full",
      category: "Cigars",
      subCat: "Boxes of Cigars",
      updatedAt: new Date(),
    };

    const result = await Product.updateOne(
      { _id: "67dbb140c69cbd865d687650" },
      { $set: update },
      { runValidators: true }
    );

    console.log('Update result:', result);
  } catch (err) {
    console.error('Error updating product:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
