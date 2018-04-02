const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
    ref : 'user',
    required : 'Owner required'
  },
  store : {
    type : Schema.Types.ObjectId,
    ref : 'store',
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

ReviewSchema.post('find', function(docs){
  return docs.map(value => value.avg = 6)
});

ReviewSchema.pre('find', function(next){
  this.populate('user');
  next(); 
})

ReviewSchema.pre('findOne', function(next){
  this.populate('user');
  next(); 
})

const Review = mongoose.model('review', ReviewSchema);

module.exports = Review;