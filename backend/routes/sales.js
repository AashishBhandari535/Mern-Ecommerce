const express = require("express");
const router = express.Router();

const {
  weeklySales,
  monthlyIncomeComp,
} = require("../controllers/salesController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

//admin
router
  .route("/admin/sales/week-sales")
  .get(isAuthenticatedUser, authorizeRoles("admin"), weeklySales);

router.route("/admin/sales/monthlyIncomeComp").get(monthlyIncomeComp);

module.exports = router;
