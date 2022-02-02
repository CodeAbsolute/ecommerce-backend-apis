const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "backend-avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password, phone, role } = req.body;
  console.log(`req-body: ${req.body}`);
  console.log(`password before hashing: ${password}`);

  const user = await User({
    name,
    email,
    phone,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    role,
  });
  console.log(`user: ${user}`);
  // try {
  const newUser = await user.save();
  console.log("newUser: ", newUser);
  // } catch (e) {
  //   console.log(`error:  ${e}`);
  // }

  res.status(201).json({
    success: true,
    user,
    message: "User created successfully, you can login now successfully",
  });
  // sendToken(user, 201, res);
});

// Logging in a User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  // console.log("user:=>", user);
  if (!user) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  console.log(`password:>> ${password}, user:>> ${user} `);
  // checking if password is correct

  const isPasswordMatched = await user.comparePassword(password);
  console.log(`isPasswordMatched: ${isPasswordMatched}`);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Detail : req.user from isAuthenticatedUser middleware
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Profile
exports.editProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    phone: req.body.phone,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "backend-avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete User profile
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.user.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
