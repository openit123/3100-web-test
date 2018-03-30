var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var mongojs = require('mongojs');
var db = mongojs('myfirst', ['pets']);
var MongoClient = require('mongodb').MongoClient,format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017', function(err,db){
    if(err){
        throw err;
    }else{
        console.log("connected");
    }
    db.close();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function (req, res) {
    res.render('index.ejs');
})

app.get('/feedback', function (req, res) {
    res.render('feedback.ejs');
})

app.get('/search', function (req, res, data) {
    db.pets.find(function (err, docs){
        console.log(docs);
        var search ={
            types_of_pet: req.body.types_of_pet,
            gender: req.body.gender,
            years_old: req.body.years_old,
        }
        res.render('search.ejs', {
            pets: docs,
            types_of_pet: search.types_of_pet,
            gender: search.gender,
            years_old: search.years_old
        });
    })
});

app.get('/signin',function (req,res){
    res.render('signin.ejs');
})

//post
app.post('/pets/add', function(req, res){

    var search ={
        types_of_pet: req.body.types_of_pet,
        gender: req.body.gender,
        years_old: req.body.years_old,
    }

    db.pets.find(function (err, docs){
        console.log(docs);
        res.render('search.ejs', {
            pets: docs,
            types_of_pet: search.types_of_pet,
            gender: search.gender,
            years_old: search.years_old
        });
    })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
