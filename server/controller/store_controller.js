const mongoose = require('mongoose');
const User = require('../model/user_model');
const Store = require('../model/store_model');
const { ErrorHandler } = require('../helper/helper');
//const Store = mongoose.model('stores');

exports.getAddListing = async (req, res, next) => {
  res.render('add-listing');
}

exports.postAddListing = async (req, res, next) => {
  try {
    //const user = await User.findById(req.session.userID);
    req.body.owner = req.session.userID; 
    const store = await (new Store(req.body)).save();
    res.redirect(`/listing/${store.slug}`);
  } catch (error) {
    next(error);
  }
  
}

exports.viewListing = async (req, res, next) => {
  const store = await Store.findOne({ slug : req.params.store });
  if(!store){ return next( ErrorHandler('Restaurant not Found', 404) ) }
  res.render('listing-detail', { store });
}

exports.manageListing = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.find({ owner : mongoose.Types.ObjectId(req.session.userID) }).sort({ created : -1 });
  res.render('manage-listing', { store });
}

exports.getListings = async (req, res, next) => {
  const stores = await Store.find();
  res.render('listing', { stores });
}

exports.getEditListing = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.findOne({ slug : req.params.store });
  if( !store ){
    return next( ErrorHandler('Listing not found',404) );
  }
  if( !(store.owner.equals(user._id)) ){
    return next( ErrorHandler('You cannot access this route',401) );
  }
  res.render('edit-listing',{ store });
}

exports.postEditListing = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.findOne({ slug : req.params.store });
  if( !store ){
    return next( ErrorHandler('Listing not found',404) );
  }
  if( !(store.owner.equals(user._id)) ){
    return next( ErrorHandler('You cannot access this route',401) );
  }
  await Store.findOneAndUpdate({ slug : req.params.store},{ $set : req.body });
  res.redirect(`/listing/${store.slug}`);
}

exports.deleteListing = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.findOne({ slug : req.params.store });
  if( !store ){
    return next( ErrorHandler('Listing not found',404) );
  }
  if( !(store.owner.equals(user._id)) ){
    return next( ErrorHandler('You cannot access this route',401) );
  }
  await Store.findOneAndRemove({ slug : req.params.store});
  console.log('We got it');
  res.redirect('/manage-listing');
}