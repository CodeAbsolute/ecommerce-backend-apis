const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/Errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/ApiFeatures");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const orderItems = req.body;
  const newOrderDetails = {
    ...orderItems,
    user: req.user._id,
  };
  console.log(newOrderDetails);
  const order = new Order(newOrderDetails);
  await order.save();
  const product = await Product.findById(orderItems.product);
  product.stock = product.stock - orderItems.quantity;
  await product.save();

  res.status(201).json({
    success: true,
    order,
  });
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("user", "name email")
    .populate("product", "productName productPrice productImages");

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const apiFeature = new ApiFeatures(
    Order.find()
      .populate("user", "name email")
      .populate(
        "product",
        "productName productDescription productPrice productImages"
      ),
    req.query
  )
    .search()
    .filter()
    .pagination(8);
  let orders = await apiFeature.query;
  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.product.productPrice;
  });
  //   orders.reduce((acc, curr) => {
  //     acc += curr;
  //   }, 0);

  res.status(200).json({
    success: true,
    ordersCount: orders.length,
    totalAmount,
    orders,
  });
});
