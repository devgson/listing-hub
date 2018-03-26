const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
    ref : 'users',
    required : 'Owner required'
  },
  store : {
    type : Schema.Types.ObjectId,
    ref : 'stores',
    required : 'Store required'
  },
  text : {
    type : String,
    required : 'Please supply some text',
    trim : true
  },
  rating : {
    type : Number,
    min : 1,
    max : 5
  },
  created : {
    type : Date,
    default : Date.now
  }
});

const Review = mongoose.model('review', ReviewSchema);

module.exports = Review;