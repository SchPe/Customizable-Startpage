
var compression = require('compression')
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

app.use(compression())

var bodyParser = require('body-parser')
app.use(bodyParser.text())
app.use(express.urlencoded({extended: true}))


require('./config/passport')(passport);

const fileLocations = require('./config/fileLocations.js');

app.use(express.static(fileLocations.publicFolder));

const db = require('./config/keys').mongoURI;


var store = new MongoDBStore({
  uri: db,
  collection: 'mySessions'
});

store.on('error', function(error) {
  console.log(error);
});

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
      if (req.headers['x-forwarded-proto'] !== 'https')
          return res.redirect('https://' + req.headers.host + req.url);
      else
          return next();
  } else
      return next();
});

app.use(
  session({
    secret: 'secret',
    store,
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/users.js'));
app.use('/data', require('./routes/data.js'));
app.use('/news', require('./routes/news.js'))
app.use('/', require('./routes/github.js'))

const PORT = process.env.PORT || 5000;
const HOST = process.env.IP || 'localhost'


app.listen(PORT, HOST, console.log(`Server started on port ${PORT}`));
