const moment = require("moment");

const User = require("../models/user");
const UserToken = require("../models/userTokenSchema");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { sendToken } = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// Register a user => /api/v1/users/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatar",
    width: 150,
    crop: "scale",
  });

  const { name, email, password, passwordConfirm, role } = req.body;
  if (password != passwordConfirm)
    return next(new ErrorHandler("Passwords not same"));

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  sendToken(user, 200, res);
});

// Login User => /api/v1/users/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password"));
  }

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // sendToken(user, 200, res);
  sendToken(user, 200, res);
});

// googleLoginUser => /api/v1/users/googleLogin
exports.googleLoginUser = catchAsyncErrors(async (req, res, next) => {
  const { code } = req.body;
  console.log("sdsdsd", code);
  const oauthClient = new OAuth2Client(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "postmessage"
  );
  const { tokens } = await oauthClient.getToken(code);
  const ticket = await oauthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.OAUTH_CLIENT_ID,
  });
  const { name, email, sub, picture } = ticket.getPayload();

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name,
      email,
      socialLogin: true,
      avatar: {
        public_id: sub,
        url: picture,
      },
      isVerified: true,
    });
    user = await user.save({ validateBeforeSave: false });
  }
  sendToken(user, 200, res);
});

// Refresh Access Token => /api/v1/users/refresh
// Refresh access token using refresh token
exports.refreshToken = catchAsyncErrors(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return next(new ErrorHandler("Forbidden", 403));

  const refreshToken = cookies.refreshToken;

  UserToken.findOne({ token: refreshToken }, (err, doc) => {
    if (!doc || err) return next(new ErrorHandler("Forbidden", 403));
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return next(new ErrorHandler("Your login has expired", 403));

      const foundUser = await User.findById(decoded.id);

      if (!foundUser) return next(new ErrorHandler("User Not Found", 403));
      const token = foundUser.generateAuthToken();

      res.status(200).json({
        token,
      });
    });
  });
});

// send Verify Email => /api/v1/users/email/verifyEmail
exports.sendVerifyEmail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get verification token
  const verifyToken = await user.getEmailToken();

  await user.save({ validateBeforeSave: false });

  const verifyEmailUrl = `${process.env.FRONTEND_URL}/email/verifyEmail/${user.id}/${verifyToken}`;
  const message = `Your verify Link is as follow:\n\n${verifyEmailUrl}\n\nIf you have not requested this email, then ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Verify Email",
      message,
    });

    res.status(200).json({
      success: true,
      message: `verify Email link sent to: ${user.email}`,
    });
  } catch (error) {
    user.verifyEmailToken = undefined;
    user.verifyEmailExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});
// Verify Email => /api/v1/user/verify/:userId/:verifyToken
exports.verifyEmail = catchAsyncErrors(async (req, res, next) => {
  //Hash URL token
  const { userId, verifyEmailToken } = req.params;
  const hashedToken = crypto
    .createHash("sha256")
    .update(verifyEmailToken)
    .digest("hex");

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User doesnt exists", 404));
  }

  const userDetails = await User.findOne({
    verifyEmailToken: hashedToken,
    verifyEmailExpire: { $gt: Date.now() },
  });

  if (!userDetails) {
    return next(
      new ErrorHandler(
        "verify Email Token  is invalid or has been expired",
        400
      )
    );
  }

  //Setup new password
  user.isVerified = true;
  user.verifyEmailToken = undefined;
  user.verifyEmailExpire = undefined;

  await user.save({ validateBeforeSave: false });

  // sendToken(user, 200, res);
  res.status(200).json({
    status: "success",
    message: "User verified successfully",
    user,
  });
});

// Forgot Password => /api/v1/users/password/forgotPassword
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset token
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Create reset password url
  // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password => /api/v1/users/password/resetPassword/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash URL token
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  //Setup new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // sendToken(user, 200, res);
  res.status(200).json({
    status: "success",
    message: "Password successfully updated",
  });
});

// Get currently logged in user details => /api/v1/users/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user profile => /api/v1/users/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const image_id = user.avatar.public_id;
    const res = await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Update / Change password => /api/v1/users/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("OldPassword is incorrect"));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Logout user => /api/v1/users/logout
exports.logOut = catchAsyncErrors(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  await UserToken.remove({ token: refreshToken });
  res.cookie("refreshToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// Admin Routes

// Get all users => /api/v1/admin/users

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  console.log(newUserData);

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete user => /api/v1/admin/user/:id

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  //Remove avatar from cloudinary - TODO

  await user.remove();

  res.status(200).json({
    success: true,
  });
});

//MonthlyUsersComp => /api/v1/admin/sales/monthlyIncomeComp
exports.monthlyUsersComp = catchAsyncErrors(async (req, res, next) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");
  const monthList = [
    new Date(previousMonth).getMonth() + 1, //previousMonth index
    new Date().getMonth() + 1, //thisMonth index
  ];
  const users = await User.aggregate([
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
  const userComp = monthList.map((month) => {
    const matchedUser = users.find((sale) => sale._id === month);
    return {
      _id: month,
      total: matchedUser ? matchedUser.total : 0,
    };
  });
  res.status(200).json({
    userComp,
  });
});
