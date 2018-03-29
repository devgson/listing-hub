const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const mongoStore = require('connect-mongo')(session);

const moment = require('moment');
const app = express();
const port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;

const mlabDB = 'mongodb://listing-hub:listing-hub@ds227459.mlab.com:27459/listing-hub';
const localDB = 'mongodb://127.0.0.1:27017/listing-hub';
mongoose.connect(mlablDB);
mongoose.connection.on('error', error => { throw new Error(error) });

/*require('./model/user_model');
require('./model/store_model');
require('./model/review_model');
*/
const User = require('./model/user_model');

app.set('json spaces', 3)
app.set('view engine','pug');
app.set('views', path.join(__dirname,'/views'))
app.use(session({
  secret : 'We move fam',
  resave : true,
  saveUninitialized : false,
  store : new mongoStore({ mongooseConnection : mongoose.connection })
}));
app.use( express.static(path.join(__dirname,'../public')) );
app.use( bodyParser.urlencoded({ extended : true }) );
app.use( bodyParser.json() );

app.use(async (req,res,next) => {
  res.locals.moment = moment;
  if(req.session && req.session.userID){
    try {
      const currentUser = await User.findById(req.session.userID);
      res.locals.currentUser = currentUser;
      next();
    } catch (error) {
      next(error);
    }
  }else{
    next();
  }
});

const routes = require('./routes/routes');
app.use( routes );

app.use((req, res) => {
  res.render('404');
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.render('404', { error } );
});
app.listen(port, () => console.log('Server started'));