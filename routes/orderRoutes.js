const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// create new order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

// get single order
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

// get logged in user orders
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// get all orders
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

module.exports = router;
