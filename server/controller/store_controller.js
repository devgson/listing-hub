const mongoose = require('mongoose');
const twilio = require('twilio');
const User = mongoose.model('user');
const Store = require('../model/store_model');
const {
  ErrorHandler
} = require('../helper/helper');
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
  const store = await Store.findOne({
    slug: req.params.store
  }).populate('owner reviews');
  if (!store) {
    return next(ErrorHandler('Restaurant not Found', 404))
  }
  res.render('listing-detail', {
    store
  });
}

exports.manageListing = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.find({
    owner: mongoose.Types.ObjectId(req.session.userID)
  }).sort({
    created: -1
  });
  res.render('manage-listing', {
    store
  });
}

exports.getListings = async (req, res, next) => {
  const stores = await Store
  .find()
  .populate('reviews');

  res.render('listing', { stores })
}

exports.getEditListing = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.findOne({
    slug: req.params.store
  });
  if (!store) {
    return next(ErrorHandler('Listing not found', 404));
  }
  if (!(store.owner.equals(user._id))) {
    return next(ErrorHandler('You cannot access this route', 401));
  }
  res.render('edit-listing', {
    store
  });
}

exports.postEditListing = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.findOne({
    slug: req.params.store
  });
  if (!store) {
    return next(ErrorHandler('Listing not found', 404));
  }
  if (!(store.owner.equals(user._id))) {
    return next(ErrorHandler('You cannot access this route', 401));
  }
  await Store.findOneAndUpdate({
    slug: req.params.store
  }, {
    $set: req.body
  });
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
    const stores = await Store.find({ $text: { $search: "" + req.body.keyword +" " + req.body.location + " " + req.body.category }});
    res.render('search', { stores });
  } catch (error) {
    next( ErrorHandler('invalid search',401) );
  }
}

exports.reserveListing = async (req, res, next) => {
  const store = await Store.findOne({ slug : req.params.store });
  const accountId = 'ACa4b6eb6e5a989e228146927a06d9d14c';
  const token = '21681c544c58a4cc569b4d10f532cbcb'
  const client = new twilio(accountId, token);
  const body = `name : ${req.body.reservationName}, date : ${req.body.date}, time : ${req.body.time}, phone Number : ${req.body.phone}, number of reservations : ${req.body.number}, extra information : ${req.body.text}`;
  await client.messages.create({ body, to : store.info.phone, from : '+15013024097' })
  res.redirect('back');
}

exports.bookmark = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.findOne({ slug : req.params.store });
  if (!store) {
    return next(ErrorHandler('Listing not found', 404));
  }
  const book = await User.update({ email : user.email },{
    $addToSet : { bookmarks : store._id }
  });
  res.send('done');
}

exports.removeBookmark = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.findOne({ slug : req.params.store });
  if (!store) {
    return next(ErrorHandler('Listing not found', 404));
  }
  const book = await User.update({ email : user.email },{
    $pull : { bookmarks : mongoose.Types.ObjectId(store._id) }
  });
  res.send('Removed');
}