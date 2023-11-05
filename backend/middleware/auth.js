const User = require("../models/user");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ errMessage: "Forbidden" });
      req.user = await User.findById(decoded.id);
      next();
    });
  }
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 403));
  }
});
// Checks if user is verified or not
exports.isVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return next(
      new ErrorHandler(
        "verify email address first to access this resource",
        403
      )
    );
  }
  next();
};

// Handling users roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
