const moment = require("moment");

const Order = require("../models/order");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Weekly sales => /api/v1/admin/sales/week-sales
exports.weeklySales = catchAsyncErrors(async (req, res, next) => {
  // const income = await Order.aggregate([
  //   {
  //     $match: {
  //       paidAt: { $gte: moment().endOf("day").subtract(7, "days").toDate() },
  //     },
  //   },
  //   {
  //     $project: {
  //       paidAt: "$paidAt",
  //       day: { $dayOfWeek: "$paidAt" },
  //       total: "$totalPrice",
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: "$day",
  //       total: { $sum: "$total" },
  //       paidAt: { $first: "$paidAt" },
  //     },
  //   },
  //   { $sort: { paidAt: 1 } },
  // ]);
  const today = moment();
  const last7daysDate = Array(7)
    .fill()
    .map(() => today.subtract(1, "d").format("YYYY-MM-DD"));
  const income = await Order.aggregate([
    {
      $match: {
        paidAt: { $gte: moment().startOf("day").subtract(7, "days").toDate() },
      },
    },
    {
      $project: {
        paidAt: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$paidAt",
          },
        },
        day: { $dayOfWeek: "$paidAt" },
        total: "$totalPrice",
      },
    },
    {
      $group: {
        _id: "$day",
        total: { $sum: "$total" },
        paidAt: { $first: "$paidAt" },
      },
    },
    {
      $project: {
        paidAt: 1,
        _id: 0,
        total: 1,
      },
    },
    {
      $group: {
        _id: null,
        documents: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        documents: {
          $map: {
            input: last7daysDate,
            as: "paidAt",
            in: {
              $let: {
                vars: {
                  paidAtIndex: {
                    $indexOfArray: ["$documents.paidAt", "$$paidAt"],
                  },
                },
                in: {
                  $cond: {
                    if: { $ne: ["$$paidAtIndex", -1] },
                    then: {
                      $arrayElemAt: ["$documents", "$$paidAtIndex"],
                    },
                    else: {
                      total: 0,
                      paidAt: "$$paidAt",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $unwind: "$documents",
    },
    {
      $replaceRoot: {
        newRoot: "$documents",
      },
    },
    { $sort: { paidAt: 1 } },
  ]);
  res.status(200).json({
    last7daysIncome: income,
  });
});

//MonthlyIncomeComp => /api/v1/admin/sales/monthlyIncomeComp
exports.monthlyIncomeComp = catchAsyncErrors(async (req, res, next) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  const orders = await Order.aggregate([
    {
      $match: { createdAt: { $gte: new Date(previousMonth) } },
    },
    {
      $project: {
        month: { $month: "$paidAt" },
        totalPrice: "$totalPrice",
      },
    },
    {
      $group: {
        _id: "$month",
        totalPrice: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: -1 } },
  ]);
  res.status(200).json({
    sales: orders,
  });
});
