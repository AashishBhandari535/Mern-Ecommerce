const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  isVerified: {
    type: Boolean,
    defailt: false,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Your password must be longer than 6 characters"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  socialLogin: {
    type: Boolean,
    default: "false",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verifyEmailToken: String,
  verifyEmailExpire: Date,
});
// Document middleware
// Encrypting password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT access token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
  return token;
};

// Retrun JWT refresh token
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return refreshToken;
};

//Generate email verify token
userSchema.methods.getEmailToken = async function () {
  // Generate token
  const verifyEmailToken = await crypto.randomBytes(32).toString("hex");

  // Hash and set to verifyEmailToken
  this.verifyEmailToken = await crypto
    .createHash("sha256")
    .update(verifyEmailToken)
    .digest("hex");

  // Hash and set to verifyEmailToken
  this.verifyEmailExpire = Date.now() + 30 * 60 * 1000;

  return verifyEmailToken;
};
//Generate password reset token
userSchema.methods.getResetPasswordToken = async function () {
  // Generate token
  const resetToken = await crypto.randomBytes(32).toString("hex");

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Hash and set to resetPasswordToken
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
