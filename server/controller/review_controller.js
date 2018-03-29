const Review = require('../model/review_model');
const User = require('../model/user_model');

exports.postReview = async (req, res, next) => {
  const user = res.locals.currentUser
  const storeId = req.params.id;
  const review = {
    user : user._id,
    store : storeId,
    text : req.body.content,
    rating : req.body.rating
  }
  await (new Review(review)).save();
  res.redirect('back');
}