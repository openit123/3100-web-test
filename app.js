var express = require('express'); //MUST USE
var path = require('path');
var cookieParser = require('cookie-parser');// for cookies
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');// for handling session
var passport = require('passport'); // for login function
var LocalStrategy = require('passport-local').Strategy; // for local connection, can swtich to http
var mongo = require('mongodb'); // database: Mongo DB
var mongoose = require('mongoose'); // API between nodejs and mongo

mongoose.connect('mongodb://localhost/loginapp'); // can modify the last items 'abc'
var db = mongoose.connection;

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());
app.get('/feedback', function(req, res) {
    res.render('trash_feedback/trash', {title:'Feedback'});
});

app.get('/feedback/text', function(req, res) {
    let input = req.query.text;
    res.json({result: input});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);

// Set Port to :3000
app.listen(3000, function(){
	console.log('Server started on port 3000');
});
