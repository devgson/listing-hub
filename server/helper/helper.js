const flat = require('flat');

const cloudinary = () => {
  const cloud = require('cloudinary');  
  cloud.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
  });
  return cloud;
}

const ErrorHandler = (message, status = 401) => {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = {
  ErrorHandler,
  cloudinary,
  flat
}