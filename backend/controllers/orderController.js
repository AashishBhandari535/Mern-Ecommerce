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

  orderItems.forEach(async (orderItem) => {
    const product = await Product.findOne({ _id: orderItem.product });
    if (product) {
      let stock = product.stock - orderItem.quantity;
      if (stock < 0) {
        stock = 0;
      }
      await Product.findByIdAndUpdate(product._id, { stock }, { new: true });
    }
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

//MonthlyOrdersComp => /api/v1/admin/orders/monthlyOrdersComp
exports.monthlyOrdersComp = catchAsyncErrors(async (req, res, next) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");
  const monthList = [
    new Date(previousMonth).getMonth() + 1, //previousMonth index
    new Date().getMonth() + 1, //thisMonth index
  ];

  const orders = await Order.aggregate([
    {
      $match: { createdAt: { $gte: new Date(previousMonth) } },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);
  const orderComp = monthList.map((month) => {
    const matchedOrder = orders.find((sale) => sale._id === month);
    return {
      _id: month,
      total: matchedOrder ? matchedOrder.total : 0,
    };
  });
  res.status(200).json({
    orderComp,
  });
});

//https://betterprogramming.pub/learn-how-to-use-group-in-mongodb-aggregation-pipeline-8fd007ad492f
//https://stackoverflow.com/questions/52235027/fill-missing-dates-in-records
//https://stackoverflow.com/questions/61973316/aggregate-by-all-days-of-month-mongodb
//https://medium.com/@alexandro.ramr777/fill-missing-values-using-mongodb-aggregation-framework-f011114e83e0
