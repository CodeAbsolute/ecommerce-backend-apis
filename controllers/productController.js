const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/ApiFeatures");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  // console.log(
  //   "req.body.images: ",
  //   req.body.productImages,
  //   "req.body.productImages.length: ",
  //   req.body.productImages.length
  // );
  if (typeof req.body.productImages === "string") {
    images.push(req.body.productImages);
  } else {
    images = req.body.productImages;
  }
  // console.log("images: ", images);

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "product-images",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  // console.log("imagesLinks: ", imagesLinks);

  req.body.productImages = imagesLinks;
  req.body.user = req.user.id;
  // create a new product and save it to the database
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// getting all products from database
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // for pagination
  const resultPerPage = 4;

  const productsCount = await Product.countDocuments();
  console.log(": ", productsCount);
  // created a clproductCountass ApiFeatures for pagination, searching and sorting products from database
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query;
  // console.log("products: ", products);

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
  });
});

// getting a single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  // finding the product from the products db
  console.log("inside route", req.body, req.params);

  let product = await Product.findById(req.params.id);
  console.log(`product: ${product}`);
  if (!product) next(new ErrorHandler("couldn't find product", 404));
  res.status(200).json({
    success: true,
    message: "Product Details: ",
    product,
  });
});
