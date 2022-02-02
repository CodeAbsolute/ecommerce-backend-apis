const {
  createProduct,
  getAllProducts,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = require("express").Router();

// create a product route
router
  .route("/admin/products/create")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

// browse all products route
router.route("/products").get(getAllProducts);
module.exports = router;
