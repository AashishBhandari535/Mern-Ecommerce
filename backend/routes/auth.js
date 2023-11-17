const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logOut,
  sendVerifyEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
  updatePassword,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  refreshToken,
  googleLoginUser,
  monthlyUsersComp,
} = require("../controllers/authController");

const {
  isAuthenticatedUser,
  authorizeRoles,
  isVerified,
} = require("../middleware/auth");

router.route("/users/register").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/users/googleLogin").post(googleLoginUser);
router.route("/users/refresh").get(refreshToken);

router.route("/users/password/forgotPassword").post(forgotPassword);

router.route("/users/password/resetPassword/:token").patch(resetPassword);

router.route("/users/logout").post(logOut);

router.route("/users/me").get(isAuthenticatedUser, getUserProfile);
router
  .route("/users/password/update")
  .put(isAuthenticatedUser, isVerified, updatePassword);
router
  .route("/users/me/update")
  .put(isAuthenticatedUser, isVerified, updateProfile);
router
  .route("/users/email/verifyEmail")
  .post(isAuthenticatedUser, sendVerifyEmail);
router
  .route("/users/email/verify/:userId/:verifyEmailToken")
  .patch(isAuthenticatedUser, verifyEmail);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route("/admin/users/monthlyUsersComp").get(monthlyUsersComp);

module.exports = router;
