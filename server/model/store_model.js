const mongoose = require('mongoose');
const validator = require('validator');
const slug = require('slugs');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  title : {
    type : String,
    required : 'Please supply a title',
    trim : true
  },
  slug : {
    type : String
  },
  description : {
    type : String,
    required : 'Please give a description',
    trim : true
  },
  owner : {
    type : Schema.Types.ObjectId,
    ref : 'user'
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

StoreSchema.virtual('reviews',{
  ref : 'review',
  localField : '_id',
  foreignField : 'store'  
})

StoreSchema.pre('save', async function(next) {
  if(!this.isModified('title')){
    return next();
  }
  this.slug = slug(this.title);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`,'i');
  const storesWithSlug = await this.constructor.find({  slug : slugRegEx });
  if(storesWithSlug.length){
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

const Store = mongoose.model('store', StoreSchema);

module.exports = Store;