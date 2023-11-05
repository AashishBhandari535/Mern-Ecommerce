const express = require("express");
const router = express.Router();

const {
  getProducts,
  getAdminProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getProducts1,
} = require("../controllers/productController");

const {
  isAuthenticatedUser,
  authorizeRoles,
  isVerified,
} = require("../middleware/auth");

router.route("/products").get(getProducts);
router.route("/admin/products").get(getAdminProducts);
router.route("/product/:id").get(getSingleProduct);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/review")
  .put(isAuthenticatedUser, isVerified, createProductReview);
router
  .route("/reviews")
  .get(isAuthenticatedUser, isVerified, getProductReviews);
router.route("/reviews").delete(isAuthenticatedUser, isVerified, deleteReview);

module.exports = router;
