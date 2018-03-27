const mongoose = require('mongoose');
const validator = require('validator');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  title : {
    type : String,
    required : 'Please supply a title',
    trim : true
  },
  description : {
    type : String,
    required : 'Please give a description',
    trim : true
  },
  owner : {
    type : Schema.Types.ObjectId,
    ref : 'users'
  },
  category : {
    type : String
  },
  info : {
    website : {
      type : String
    },
    phone : {
      type : String,
      required : 'Please supply a phone number'
    },
    email : {
      type : String,
      validate : [validator.isEmail,'Email address invalid'],
      required : 'Please supply an email'
    },
    state : {
      type : String,
      required : 'Please supply a state'
    },
    country : {
      type : String,
      required : 'Please supply a country'
    },
    address : {
      type : String,
      required : 'Please supply an address'
    }
  },
  tags : [String],
  images : [String],
  hours : {},
  social_media : {
    twitter : {
      type :  String
    },
    facebook : {
      type : String
    }
  },
  created : {
    type : Date,
    default : Date.now
  }
});

const Store = mongoose.model('store', StoreSchema);

module.exports = Store;