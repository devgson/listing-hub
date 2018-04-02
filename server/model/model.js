const users = {
  _id : 1234,
  Username : 'Gaba',
  email : 'gaba@gmail.com',
  password : 'gabazin',
  location : {
    state : "Lagos",
    country : "Nigeria",
    address : "No 1 gaba street, gaba estate"
  },
  social_media : {
    twitter : "https://twitter.com/gaba",
    facebook : "https://favebook.com/gaba"
  },
  photo : "http:imgur/img.jpg",
  //Bookmarks also store an array of favourited listings
  bookmarks : [1],
  //ids gotten from Listing, a user can have multiple listings
  listings : [1],
  createdAt : 1231241
}

const listings  = {
  _id : 1,
  title : 'Evobar',
  description : "bla bla bla",
  author : 1234,
  location : {
    state : "Lagos",
    country : "Nigeria",
    city : "??",
    address : "No 1 gaba street, gaba estate",
    zipcode : 234,
    //Automatically generated
    coordinates : {
      lat : 12,
      lon : 14
    }
  },
  category : 'Restaurant',
  //Stores the review id on a particular listing
  reviews : [987],
  //Tags for a restaurant
  tags : ["free food","free wifi"],
  //Images are stored as links pointing to external sites
  images : ["https://imgur/img.jpg","https://imgur/img2.jpg"],
  header_image : "http:imgur/img.jpg",
  //Opening and closing hours
  hours : [
    { "Monday" : "1,5" },
    { "Tuesday" : "1,5" },
    { "Wednesday" : "1,5" },
    { "Thursday" : "1,5" },
    { "Friday" : "1,5" }
  ],
  social_media : {
    twitter : "https://twitter.com/gaba",
    facebook : "https://favebook.com/gaba"
  },
  createdAt : 1231241
}

//So basically to get reviews made by a user, all you do is provide
//the user id and get a list of all the reviews made by the user
const reviews = {
  _id : 987,
  user : 1234,
  listing : 1,
  content : 'Restaurant was good',
  star : 4,
  createdAt : 1231241
}
