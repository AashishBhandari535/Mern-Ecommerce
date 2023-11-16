const express = require("express");
const router = express.Router();

const {
  processPayment,
  sendStripeApi,
  paymentSession,
} = require("../controllers/paymentController");

const { isAuthenticatedUser, isVerified } = require("../middleware/auth");

router
  .route("/payment/process")
  .post(isAuthenticatedUser, isVerified, processPayment);
router.route("/stripeapi").get(isAuthenticatedUser, isVerified, sendStripeApi);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   paymentSession
// );

module.exports = router;
