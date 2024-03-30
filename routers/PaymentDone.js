const express = require("express");

const router = express.Router();
const { Payment } = require("../modals/Payment");
const { Users } = require("../modals/users");
const { Orders } = require("../modals/orders");
const { Products } = require("../modals/products");

router.post(`/payment/:id`, async (req, resp) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) return resp.status(404).send("Please login");

    let payment = new Payment({
      razorpay_payment_id: req.body.razorpay_payment_id,
      totalAmount: req.body.totalAmount,
    });

    payment = await payment.save();
    if (!payment) return resp.status(404).send("payment is not added");
    user.Payments.push(payment._id);

    const orderitems = req.body.orderItems;
    let keys = [];
    let data = [];
    for (let i = 0; i < orderitems.length; i++) {
      const productordered = await Products.findById(orderitems[i]);
      data.push(productordered);
      keys.push(productordered.gameKeys.shift());
      await productordered.save({ validateBeforeSave: false });
    }
    const promises = data.forEach(async (item) => {
      let Order = new Orders({
        name: item.name,
        description: item.description,
        image: [...item.image], // "http://localhost:3000/public/upload/image-2323232"
        brand: item.brand,
        banner: item.banner,
        price: item.price,
        category: item.category,
        gameKeys: item.gameKeys,
        rating: item.rating,
        playStation: item.playStation,
        Xbox: item.Xbox,
        PC: item.PC,
        gameKey: keys[0],
        productId: item._id,
      });
      console.log(keys);
      const v = keys.length;
      keys = keys.slice(1, v - 1);
      Order = await Order.save();
      console.log(Order._id);
      user.orderIds.push(Order._id);
      user.save();
    });
    await Promise.all(promises);
    await user.save();

    console.log(user);
    resp.send({ payment: payment, user: user });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
