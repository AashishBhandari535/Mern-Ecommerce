const express = require("express");
const router = express.Router();

const {
  processPayment,
  sendStripeApi,
} = require("../controllers/paymentController");

const { isAuthenticatedUser, isVerified } = require("../middleware/auth");

router
  .route("/payment/process")
  .post(isAuthenticatedUser, isVerified, processPayment);
router.route("/stripeapi").get(isAuthenticatedUser, isVerified, sendStripeApi);

module.exports = router;
