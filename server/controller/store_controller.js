const mongoose = require('mongoose');
const User = require('../model/user_model');
const Store = require('../model/store_model');
//const Store = mongoose.model('stores');

exports.getAddListing = async (req, res, next) => {
  res.render('add-listing');
}

exports.postAddListing = async (req, res, next) => {
  try {
    //const user = await User.findById(req.session.userID);
    req.body.owner = req.session.userID; 
    const store = await (new Store(req.body)).save();
    res.redirect('/listing-detail');
  } catch (error) {
    next(error);
  }
  
}

exports.viewListing = async (req, res, next) => {
  const store = await Store.findOne({ _id : mongoose.Types.ObjectId(req.params.id) });
  res.render('listing-detail', { store });
}