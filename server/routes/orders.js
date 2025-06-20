const { Orders } = require('../models/orders');
const express = require('express');
const { updateStockInErply } = require("../utils/erplyService");
const router = express.Router();
const { Product } = require("../models/products");


router.get(`/`, async (req, res) => {
    try {
        const allowedFilters = ['userid', 'status'];
        const query = {};
        for (const key of allowedFilters) {
            if (req.query[key]) {
                query[key] = req.query[key];
            }
        }

        const ordersList = await Orders.find(query);

        if (!ordersList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(ordersList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});


router.get('/:id', async (req, res) => {

    const order = await Orders.findById(req.params.id);

    if (!order) {
        res.status(500).json({ message: 'The order with the given ID was not found.' })
    }
    return res.status(200).send(order);
})

router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Orders.countDocuments()

    if(!orderCount) {
        res.status(500).json({success: false})
    } else{
        res.send({
            orderCount: orderCount
        });
    }
   
})

// API: Place Order and Update ERPLY Stock
router.post("/create", async (req, res) => {
    try {
      let order = new Orders({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        amount: req.body.amount,
        paymentId: req.body.paymentId,
        email: req.body.email,
        userid: req.body.userid,
        products: req.body.products,
        date: req.body.date,
      });
  
      console.log("🛒 New Order Received:", order);
  
      order = await order.save();
  
      for (const item of req.body.products) {
        const product = await Product.findOne({ productID: item.productID });
  
        if (product) {
          const newStock = product.stock - item.quantity;
  
          // Update stock in ERPLY
          await updateStockInErply(item.productID, newStock);
  
          // Update stock in MongoDB
          await Product.findOneAndUpdate({ productID: item.productID }, { stock: newStock });
        }
      }
  
      res.status(201).json({ message: "✅ Order placed & ERPLY stock updated", order });
    } catch (error) {
      console.error("❌ Order Processing Failed:", error);
      res.status(500).json({ error: "Order processing failed" });
    }
  });

router.delete('/:id', async (req, res) => {

    const deletedOrder = await Orders.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
        res.status(404).json({
            message: 'Order not found!',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Order Deleted!'
    })
});


router.put('/:id', async (req, res) => {

    const order = await Orders.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            pincode: req.body.pincode,
            amount: req.body.amount,
            paymentId: req.body.paymentId,
            email: req.body.email,
            userid: req.body.userid,
            products: req.body.products,
            status:req.body.status
        },
        { new: true }
    )



    if (!order) {
        return res.status(500).json({
            message: 'Order cannot be updated!',
            success: false
        })
    }

    res.send(order);

})



module.exports = router;

