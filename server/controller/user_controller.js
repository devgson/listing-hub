const User = require('../model/user_model');
const { ErrorHandler, cloudinary, flat} = require('../helper/helper');

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
  try {
    const user = res.locals.currentUser;
    if( req.files.photo ){
      if( user.photo.public_id ){ await deleteUpload(user.photo.public_id) }
      const image = await upload(req.files.photo);
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