const mongoose = require('mongoose');
require('dotenv').config({ path : 'variables.env' });
const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const mongoStore = require('connect-mongo')(session);
const moment = require('moment');
const app = express();
const port = process.env.PORT || 3000;
const db = process.argv.includes('production') ? process.env.MLAB_DB : process.env.LOCAL_DB;

mongoose.Promise = global.Promise;
mongoose.connect(db);
mongoose.connection.on('error', error => { throw new Error(error) });

const User = require('./model/user_model');

app.set('json spaces', 3)
app.set('view engine','pug');
app.set('views', path.join(__dirname,'/views'))
app.use(session({
  secret : 'n8w7y%#ubhj487$%^#358gwwjng2$%',
  resave : true,
  saveUninitialized : false,
  store : new mongoStore({ mongooseConnection : mongoose.connection })
}));
app.use( fileUpload() );
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