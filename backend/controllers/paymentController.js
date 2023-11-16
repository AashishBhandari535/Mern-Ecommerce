const dotenv = require("dotenv");

dotenv.config({
  path: `${__dirname}/../config/config.env`,
});

const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",

    metadata: { integration_check: "accept_a_payment" },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

//
// exports.paymentSession = catchAsyncErrors(async (req, res, next) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.rawBody,
//       sig,
//       process.env.ENDPOINTSECRET
//     );
//   } catch (err) {
//     res.status(400).send(`Webhook Error:${err.message}`);
//     return;
//   }
//   console.log(event);
//   // Return a 200 response to acknowledge receipt of the event
//   res.send();
// });
// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripeApi = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});
