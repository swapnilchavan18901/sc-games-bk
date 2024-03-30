const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const api = process.env.API_URL;
const productRouter = require("./routers/products");
const usersRoutes = require("./routers/users");
const paymentdone = require("./routers/PaymentDone");
const Orders = require("./routers/orders");
const Reviews = require("./routers/Reviews");

const categoriesRoutes = require("./routers/category");
const {
  sendRazorpayKey,
  captureRazorpayPayment,
} = require("./controllers/Payment");

const authJwt = require("./helpers/jwt");
const errorhandler = require("./helpers/errorhandler");

app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorhandler);
app.use(express.urlencoded());
app.use(express.json());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
//ROUTES
app.use(`${api}/products`, productRouter);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/razorpaykey`, sendRazorpayKey);
app.use(`${api}/capturerazorpay`, captureRazorpayPayment);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/`, paymentdone);
app.use(`${api}/orders`, Orders);
app.use(`${api}/reviews`, Reviews);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then((res) => {
    console.log("database is connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(5000, () => {
  console.log("port on 5000");
});
