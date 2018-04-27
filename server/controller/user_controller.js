const User = require('../model/user_model');
const { ErrorHandler, cloudinary, flat} = require('../helper/helper');

function upload(image){
  return new Promise( (resolve, reject) =>{
    cloudinary().uploader.upload_stream( (result) => resolve(result) )
    .end(image.data);
  })
}

function deleteUpload(image){
  return new Promise((resolve, reject) => {
    cloudinary().v2.uploader.destroy(image, (error, result) => {
      if(error) res.json(error)
      resolve(result);
    })
  })
}

exports.isUserLoggedin = async (req, res, next) => {
  (req.session && req.session.userID) ? next() : res.redirect('/login');
}

exports.signup = async (req, res, next) => {
  try {
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
    if( !user ){ return next( ErrorHandler('Wrong Email', 401) ) }
    if( !(await user.validatePassword(password)) ){ return next( ErrorHandler('Wrong password', 401) ); }
    req.session.userID = user._id;
    res.redirect('/edit-profile');
  } catch (error) {
    next(error);
  }
}

exports.postEditProfile = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    if( req.files.photo ){
      if( user.photo ){ await deleteUpload(user.photo.public_id) }
      const image = await upload(req.files.photo);
      if( image.public_id == null ) next( ErrorHandler('Error uploading') );
      req.body["photo"] = {
        public_id : image.public_id,
        url : image.url,
        secure_url : image.secure_url
      }     
    }
    await User.findByIdAndUpdate(user._id, { $set : flat.flatten(req.body) });
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
}

exports.getEditProfile = async (req, res, next) => {
  const user = res.locals.currentUser;
  res.render('edit-profile', { user });
}

exports.getProfile = async (req, res, next) => {
  const user = res.locals.currentUser;
  res.render('profile-detail', { user });
}

exports.login = async (req, res, next) => {
  res.render('login');
}

exports.logout = async (req, res, next) => {
  if( req.session && req.session.userID ){
    req.session.destroy();
    res.redirect('/login');
  }
}