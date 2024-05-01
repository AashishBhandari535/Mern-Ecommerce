const UserToken = require("../models/userTokenSchema");

//Create and send access token,refresh token and save in the cookie

const sendToken = async (user, statusCode, res) => {
  // Create auth token
  const token = user.generateAuthToken();
  //Create refresh token
  const refreshToken = user.generateRefreshToken();

  const userToken = await UserToken.findOne({ user: user._id });
  if (userToken) await userToken.remove();
  await UserToken.create({ user: user._id, token: refreshToken });

  //Create secure cookie with refresh token
  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      token,
      user,
    });
};

module.exports = { sendToken };
