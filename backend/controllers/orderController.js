const moment = require("moment");

const Order = require("../models/order");
const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create a new order => /api/v1/order/new

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// Get  single order => /api/v1/order/:id

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in  user order => /api/v1/orders/me

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders => /api/v1/admin/orders/

exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update / Process order -ADMIN => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product);
  });

  (order.orderStatus = req.body.status), (order.deliveredAt = Date.now());

  await order.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;
}

// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

// Weekly sales => /api/v1/week-sales
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
        paidAt: { $gte: moment().subtract(7, "days").toDate() },
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
        day: "$_id",
        total: "$totalPrice",
      },
    },
    {
      $group: {
        _id: 0,
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

//https://betterprogramming.pub/learn-how-to-use-group-in-mongodb-aggregation-pipeline-8fd007ad492f
//https://stackoverflow.com/questions/52235027/fill-missing-dates-in-records
//https://stackoverflow.com/questions/61973316/aggregate-by-all-days-of-month-mongodb
//https://medium.com/@alexandro.ramr777/fill-missing-values-using-mongodb-aggregation-framework-f011114e83e0
