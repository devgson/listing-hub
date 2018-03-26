const _ = require('lodash');
const User = require('../model/user_model');
const { ErrorHandler } = require('../helper/helper');

exports.checkLogin = async (req, res, next) => {
  if(req.session && req.session.userID){
    next()
  }else{
    res.redirect('/login');
  }
}

exports.signup = async (req, res, next) => {
  try {
    //const body = _.pick(req.body, ['name','email','username','country','state','password','confirmPassword'] );
    const { name, email, country ,state, password, confirmPassword } = req.body;
    if( password !== confirmPassword ){
      console.log(password);
      console.log(confirmPassword);
      return next( ErrorHandler('Passwords do not match', 401) );
    }
    const body = { name, email, info : { country, state }, password };
    const user = await (new User(body)).save();
    req.session.userID = user._id;
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
}

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if( !user ){
      return next( ErrorHandler('Wrong Email', 401) );
    }
    if( !(await user.validatePassword(password)) ){
      return next( ErrorHandler('Wrong password', 401) );
    }
    req.session.userID = user._id;
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
}

exports.editProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    const body = _.pick(req.body, ['phone','address','facebook','twitter'] );
    const pack = {
      "info.phone" : body.phone || '',
      "info.address" : body.address || '',
      "social_media.facebook" : body.facebook || '',
      "social_media.twitter" : body.twitter || ''
    } 
    Object.keys(pack).forEach(key => { if(pack[key] === ''){ delete pack[key]; } });
    await User.findByIdAndUpdate(user._id, { $set : pack });
    res.redirect('/edit-profile');
  } catch (error) {
    next(error);
  }
}

exports.viewProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    res.render('edit-profile', {
      name : user.name,
      email : user.email,
      phone : user.info.phone || '',
      country : user.info.country,
      state : user.info.state,
      address : user.info.address || '',
      facebook : user.social_media.facebook || '',
      twitter : user.social_media.twitter || ''
    });
  } catch (error) {
    next(error)
  }
}

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    res.render('profile-detail', {
      name : user.name,
      email : user.email,
      phone : user.info.phone || '',
      country : user.info.country,
      state : user.info.state,
      address : user.info.address || '',
      facebook : user.social_media.facebook || '',
      twitter : user.social_media.twitter || ''
    });
  } catch (error) {
    next(error)
  }
}