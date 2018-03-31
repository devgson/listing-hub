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
    if( req.body.password !== req.body.confirmPassword ){ return next( ErrorHandler('Passwords do not match', 401) );}
    delete req.body.confirmPassword;
    const user = await (new User(req.body)).save();
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
    if( !user ){ return next( ErrorHandler('Wrong Email', 401) ); }
    if( !(await user.validatePassword(password)) ){ return next( ErrorHandler('Wrong password', 401) ); }
    req.session.userID = user._id;
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
}

exports.editProfile = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    //const body = _.pick(req.body, ['phone','address','facebook','twitter'] );
    const { phone, address, facebook, twitter } = req.body;
    const pack = {
      "info.phone" : phone,
      "info.address" : address,
      "social_media.facebook" : facebook,
      "social_media.twitter" : twitter
    } 
    //Object.keys(pack).forEach(key => { if( (pack[key]) === undefined ){ delete pack[key]; } });
    await User.findByIdAndUpdate(user._id, { $set : pack });
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
}

exports.viewProfile = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    res.render('edit-profile', { user });
  } catch (error) {
    next(error)
  }
}

exports.getProfile = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    res.render('profile-detail', { user } );
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  res.render('login');
}

exports.logout = async (req, res, next) => {
  if(req.session && req.session.userID){
    req.session.destroy();
    res.redirect('/login');
  }
}