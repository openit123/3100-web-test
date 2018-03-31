var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
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

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.locals.errors = null;
    res.locals.type_of_p = null;
    res.locals.p_gender = null;
    res.locals.p_age = null;
    res.locals.p_description = null;
    res.locals.district = null;
    res.locals.country = null;
    res.locals.zone = null;
    res.locals.emailaddr = null;
    next();
});

app.get('/', function (req, res) {
    res.render('index.ejs');
})

app.get('/feedback', function (req, res) {
    res.render('feedback.ejs');
})

app.get('/profile', function (req, res, data){
    var username = {username:"alvin123"};
    var info = [];
    db.pets.update(function (err, docs){
       // console.log(docs);
        res.render('profile.ejs' , {
            pets: docs,
        });
    })
    db.pets.find(username, function (err, info, docs){
       // console.log(docs);
        info.push(info);
        console.log(info);
        res.render('profile.ejs', {
            pets: docs,
            info: info,
        });
    })
})

app.post('/profile', function(req, res){
    var update ={ $set:
            {
                f_name: req.body.f_name,
                l_name: req.body.l_name,
                p_name: req.body.p_name,
                type_of_p: req.body.type_of_p,
                p_gender: req.body.p_gender,
                p_age: req.body.p_age,
                district: req.body.district,
                zone: req.body.zone,
                country: req.body.country,
                username: req.body.username,
                p_description: req.body.p_description,
                password: req.body.password,
                emailaddr: req.body.emailaddr
            }
    }
    var user = {username: req.body.username};
    db.pets.update(user, update, function (err, docs){
        console.log(docs);
        res.render('profile.ejs' , {
            pets: docs,
            f_name: update.f_name,
            l_name: update.l_name,
            p_name: update.p_name,
            type_of_p: update.type_of_p,
            p_gender: update.p_gender,
            p_age: update.p_age,
            district: update.district,
            zone: update.zone,
            country: update.country,
            username: update.username,
            p_description: update.p_description,
            password: update.password,
            emailaddr: update.emailaddr
        });
    })
})

app.get('/search', function(req, res, data){
    db.pets.find(function (err, docs){
        console.log(docs);
    res.render('search.ejs', {
            pets: docs,
        });
    })
})

app.post('/search', function(req, res){
    var search ={
        type_of_p: req.body.type_of_p,
        p_gender: req.body.p_gender,
        p_age: req.body.p_age,
    }
    db.pets.find(function (err, docs){
        console.log(docs);
        res.render('search.ejs', {
            pets: docs,
            type_of_p: search.type_of_p,
            p_gender: search.p_gender,
            p_age: search.p_age
        });
    })
});

app.get('/signin',function (req,res){
    res.render('signin.ejs');
})

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

/*use these data as testcases!!
var pets = [
  {
    id: 1,
    name: 'teddy',
    types_of_pet: 'dog',
    gender: 'm',
    years_old: 5
  },
  {
    id: 2,
    name: 'tommy',
    types_of_pet: 'cat',
    gender: 'm',
    years_old: 2
  },
  {
    id: 3,
    name: 'cody',
    types_of_pet: 'dog',
    gender: 'f',
    years_old: 2
  },
  {
    id: 4,
    name: 'jenny',
    types_of_pet: 'cat',
    gender: 'f',
    years_old: 7
  },
]
*/

//add them in db
//db.pets.insert({"username":"alvin123", "password":"alvin123", "emailaddr":"alvin@ymail.com", "f_name":"Alvin", "l_name":"Luk", "country":"China", "district":"HK", "zone":1, "p_name":"teddy", "p_age":5, "p_gender":"m", "type_of_p":"dog", "p_description":"h"})
//db.pets.insert({"username":"kelvin123", "password":"kelvin123", "emailaddr":"kelvin@ymail.com", "f_name":"Kelvin", "l_name":"Siu", "country":"China", "district":"HK", "zone":2, "p_name":"tommy", "p_age":2, "p_gender":"m","type_of_p":"cat", "p_description":"i"})
//db.pets.insert({"username":"matthew123", "password":"matthew123", "emailaddr":"matthew@ymail.com", "f_name":"Matthew", "l_name":"Ting", "country":"China", "district":"HK", "zone":3, "p_name":"cody", "p_age":2, "p_gender":"f","type_of_p":"dog", "p_description":"j"})
//db.pets.insert({"username":"tony123", "password":"tony123", "emailaddr":"tony@ymail.com", "f_name":"Tony", "l_name":"Tsang", "country":"China", "district":"HK", "zone":4, "p_name":"jenny", "p_age":7, "p_gender":"f","type_of_p":"cat", "p_description":"k"})
//db.pets.insert({"username":"thomas123", "password":"thomas123", "emailaddr":"thomas@ymail.com", "f_name":"Thomas", "l_name":"Li", "country":"China", "district":"HK", "zone":5, "p_name":"mas", "p_age":2, "p_gender":"m","type_of_p":"cat", "p_description":"l"})