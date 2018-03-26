const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const mongoStore = require('connect-mongo')(session);
const routes = require('./routes/routes');
const app = express();
const port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/listing-hub');
mongoose.connection.on('error', error => { throw new Error(error) });

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
app.use( bodyParser.urlencoded({ extended : false }) );
app.use( bodyParser.json() );

app.use((req,res,next) => {
  res.locals.currentUser = req.session.userID;
  next();
});

app.use( routes );

app.use((req, res) => {
  res.render('404');
});

app.use((error, req, res, next) => {
  error.status = 500 || error.status;
  res.render('404', { error } );
});
app.listen(port, () => console.log('Server started'));