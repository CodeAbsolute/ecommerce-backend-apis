const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getUserDetails,
  logout,
  editProfile,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

// create a new user
router.route("/register").post(registerUser);

// login an already registered user
router.route("/login").post(loginUser);

// logging out the user
router.route("/logout").get(logout);

// only the logged in user can access this route
// view profile of the logged in user
router.route("/profile").get(isAuthenticatedUser, getUserDetails);

// edit profile of the logged in user
router.route("/profile/edit").put(isAuthenticatedUser, editProfile);

// delete user
router.route("/profile/delete").delete(isAuthenticatedUser, deleteUser);

module.exports = router;
