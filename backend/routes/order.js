const express = require("express");
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
  updateOrder,
  deleteOrder,
  allOrders,
  weeklySales,
} = require("../controllers/orderController");

const {
  isAuthenticatedUser,
  authorizeRoles,
  isVerified,
} = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, isVerified, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, isVerified, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, isVerified, myOrders);
router.route("/week-sales").get(isAuthenticatedUser, isVerified, weeklySales);

router
  .route("/admin/orders/")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(
    isAuthenticatedUser,

    authorizeRoles("admin"),
    deleteOrder
  );

module.exports = router;
