# ecommerce-backend-apis

This project is build using ```Node.js``` ```Express.js``` and ```MongoDB Atlas``` as the database.

## Setup this project

1. Clone this repo or else download the zip file.
2. Open the terminal in your root directory.
3. Type this command ```npm install``` to install all the dependencies required to run this project.
4. Now, create a new `.env` file in your root directory and add the necessary values.
5. `.env` file structure 
 ```
PORT=4000
DB_URL=

# JWT TOKEN DETAILS ====>
JWT_SECRET=
JWT_EXPIRE=5d
COOKIE_EXPIRE=7

# Cloudinary api details====>
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
 ``` 
 Now, you are ready to run your project by running this command in your root directory `npm run start`.

### `Cloudinary` is used to store the images in this project.
### `JWT Authentication` is used in this project.
