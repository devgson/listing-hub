const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  name : {
    type : String,
    required : 'Please supply a username',
    trim : true
  },
  email : {
    type : String,
    required : 'Please supply an email address',
    unique : true,
    trim : true,
    lowercase : true,
    validate : [validator.isEmail, 'Email address invalid']
  },
  info : {
    website : {
      type : String,
      trim : true
    },
    phone : {
      type : String,
      trim : true
    },
    state : {
      type : String,
      trim : true,
    },
    address : {
      type : String,
      trim : true
    },
    country : {
      type : String,
      trim : true,
    },
  },
  social_media : {
    twitter : {
      type :  String,
      trim : true
    },
    facebook : {
      type : String,
      trim : true
    }
  },
  photo : {},
  bookmarks : [{
    type : Schema.Types.ObjectId,
    ref : 'store'
  }],
  password : {
    type : String,
    required : 'Please supply a password'
  },
  created : {
    type : Date,
    default : Date.now
  }
});

UserSchema.methods.validatePassword = async function(password){
  const user = this;
  return await bcrypt.compare(password, this.password);
}

UserSchema.pre('save', async function(next){
  const user = this;
  if( user.isModified('password') ){
    const hash = await bcrypt.hash(this.password, 10);
    user.password = hash;
    return next();
  }
  next();
});

const User = mongoose.model('user', UserSchema);

module.exports = User;