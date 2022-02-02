const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Please Enter Your Product Name"],
      maxLength: [30, "Product Name cannot exceed 30 characters"],
    },
    productDescription: {
      type: String,
      required: [true, "Please Enter Your Product Description"],
      maxLength: [500, "Product Description cannot exceed 30 characters"],
    },
    productPrice: {
      type: Number,
      required: [true, "Please Enter Your Product Price"],
      max: [1000000, "Product Price cannot exceed 1000000"],
    },
    productImages: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    productColors: [{ type: String, required: true }],
    productCategory: {
      type: String,
      required: [true, "Please Enter Your Product Category"],
    },
    stock: {
      type: Number,
      required: [true, "Please Enter product Stock"],
      maxLength: [4, "Stock cannot exceed 4 characters"],
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Product", productSchema);
