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


// exports.signup = async (req, res, next) => {
//   try {
//     //const body = _.pick(req.body, ['name','email','username','country','state','password','confirmPassword'] );
//     //const { name, email, country ,state, password, confirmPassword } = req.body;
//     if( req.body.password !== req.body.confirmPassword ){ return next( ErrorHandler('Passwords do not match', 401) );}
//     delete req.body.confirmPassword;
//     const user = await (new User(req.body)).save();
//     req.session.userID = user._id;
//     res.redirect('/profile');
//   } catch (error) {
//     next(error);
//   }
// }


exports.searchListing = async (req, res, next) => {
  try {
    //const user = await User.findById(req.session.userID);
    let search_keyword = req.body.keyword;
    let location = req.body.location;
    let category = req.body.category;
    const stores = await Store.find({ $text: { $search: "" + req.body.keyword +" " + req.body.location + " " + req.body.category }});
    console.log(stores);
    res.render('search', { stores });
  } catch (error) {
    next( ErrorHandler('invalid search',401) );
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
  const store = await Store.findOne({ slug: req.params.store }).populate('reviews');
  if (!store) {
    return next(ErrorHandler('Listing not found', 404));
  }
  if (!(store.owner.equals(user._id))) {
    return next(ErrorHandler('You cannot access this route', 401));
  }
  await Store.findOneAndRemove({ slug: req.params.store });
  store.reviews.forEach( async document => await document.remove() );  
  res.redirect('/manage-listing');
}

exports.searchListing = async (req, res, next) => {
  try {
    const stores = await Store.find(
      { $text: { $search: `"${req.body.keyword}" "${req.body.location}" ${req.body.category}` }},
      { score : { $meta : "textScore" } }
    ).sort(
      { score : { $meta : "textScore" } }
    ).populate('reviews');
    res.render('search', { stores });
  } catch (error) {
    next( ErrorHandler(error,401) );
  }
}

exports.reserveListing = async (req, res, next) => {
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