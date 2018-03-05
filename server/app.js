const express = require('express');
const path = require('path');
const routes = require('./routes/routes');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine','pug');
app.set('views', path.join(__dirname,'/views'))
app.use( express.static(path.join(__dirname,'../public')) );

app.use(routes);

app.use((req, res) => {
  res.render('404');
});

app.listen(port);