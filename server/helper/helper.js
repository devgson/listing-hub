const flat = require('flat');

const cloudinary = () => {
  const cloud = require('cloudinary');  
  cloud.config({
    cloud_name: 'gson007', 
    api_key: '675593585131373', 
    api_secret: 'kARcRbIuXfLLLA-SyLORCyJpHhI' 
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