const app = require("./app");
const { connectDatabase } = require("./db");
const cloudinary = require("cloudinary");

// connecting database
connectDatabase();
console.log(process.env.PORT);

// setting up cloudinary config for image upload
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
