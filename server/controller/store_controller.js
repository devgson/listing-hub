const mongoose = require('mongoose');
const twilio = require('twilio');
const User = mongoose.model('user');
const fetch = require("node-fetch");
const Store = require('../model/store_model');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'evolutionarytechltd@gmail.com',
         pass: 'evotech123'
     }
 });
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
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+req.body.info.address+"&key=AIzaSyA5Xy52x-VdwJtY4UnUogUXm2DnI4LRv1A";
    
    const response = await fetch(url);
    const json = await response.json();

    req.body.info.address_latitude = json.results[0].geometry.location.lat;
    req.body.info.address_longitude = json.results[0].geometry.location.lng;
    const store = await (new Store(req.body)).save();
    res.redirect(`/listing/${store.slug}`);
  } catch (error) {
    next(error);
  }
  
}


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
  const store = await Store.findOne({ slug : req.params.store }).populate('reviews');
  if(!store){ return next( ErrorHandler('Restaurant not Found', 404) ) }
  res.render('listing-detail', { store });
}

exports.manageListing = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.find({ owner : mongoose.Types.ObjectId(req.session.userID) }).sort({ created : -1 });
  res.render('manage-listing', { store });
}

exports.getListings = async (req, res, next) => {
  const stores = await Store.find().populate('reviews');
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
  const accountId = 'ACa4b6eb6e5a989e228146927a06d9d14c';
  const token = '21681c544c58a4cc569b4d10f532cbcb'
  const client = new twilio(accountId, token);
  const body = `name : ${req.body.reservationName}, date : ${req.body.date}, time : ${req.body.time}, phone Number : ${req.body.phone}, number of reservations : ${req.body.number}, extra information : ${req.body.text}`;
  await client.messages.create({ body, to : store.info.phone, from : '+15013024097' })
  res.redirect('back');
}

exports.sendMessage = async (req, res, next) => {
  const storemail = req.params.email;
   let username = req.body.username;
   let email = req.body.useremail;
   let number = req.body.phone;
   let message = req.body.text;
   var mailOptions = {
    from: email,
    to: storemail,
    subject: 'User Message', // Subject line
    html: '<div> <p>User Number is: '+ number+'</p> <p>User message is: '+ message+'</p> <p>User email is: '+ email+'</p> </div>' // html body
}
transporter.sendMail(mailOptions, function(error, info){
  if(error){
      return console.log(error);
  }
  else{
    res.send('message sent');
  }
});
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