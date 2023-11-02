const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logOut,
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
} = require("../controllers/authController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/users/register").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/users/googleLogin").post(googleLoginUser);
router.route("/users/refresh").get(refreshToken);

router.route("/users/password/forgotPassword").post(forgotPassword);

router.route("/users/password/resetPassword/:token").patch(resetPassword);

router.route("/users/logout").post(logOut);

router.route("/users/me").get(isAuthenticatedUser, getUserProfile);
router.route("/users/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/users/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
