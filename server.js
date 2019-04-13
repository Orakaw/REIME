var express  = require('express');
var app      = express();
var port     = 5000;
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes.js')(app, passport, database, ObjectId);
});

require('./config/passport.js')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs');
app.use(session({
    secret: 'rcbootcamp2019a',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.listen(port);
