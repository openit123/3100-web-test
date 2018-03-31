var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongojs = require('mongojs');
var db = mongojs('myfirst', ['pets']);
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
MongoClient.connect('mongodb://192.168.1.51:27017', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("connected");
    }
    db.close();
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'saifbabfuisabf',
    cookie: {maxAge: 60 * 1000 * 30},
    saveUninitialized: true,
    resave: true,
}));
app.use(function (req, res, next) {
    res.locals.errors = null;
    res.locals.types_of_pet = null;
    res.locals.gender = null;
    res.locals.years_old = null;
    next();
});

app.get('/', function (req, res) {
    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    } else {
        console.log("Session not assign");
        // req.session.sign = true;
        // var ssn = req.session;
        // ssn.email = "wqkrbe@gmail.com";
        // console.log(ssn.email);
    }
    res.render('index.ejs', {isLogined: logined});
});

app.get('/feedback', function (req, res) {
    res.render('feedback.ejs');
});

app.get('/profile', function (req, res) {
    res.render('profile.ejs');
});
app.get('/profile', function (req, res, data) {
    db.pets.save(function (err, docs) {
        console.log(docs);
        res.render('profile.ejs', {
            pets: docs,
        });
    })
    db.pets.find(function (err, docs) {
        console.log(docs);
        res.render('profile.ejs', {
            pets: docs,
        });
    })
})

app.post('/profile/update', function (req, res) {
    var update = {
        type_of_pet: req.body.type_of_pet,
        p_gender: req.body.p_gender,
        p_age: req.body.p_age,
        district: req.body.district,
        zone: req.body.zone,
        country: req.body.country,
        username: req.body.username,
        p_description: req.body.p_description,
    }
    db.pets.save(function (err, docs) {
        console.log(docs);
        res.render('profile.ejs', {
            pets: docs,
            type_of_pet: update.type_of_pet,
            p_gender: update.p_gender,
            p_age: update.p_age,
            district: update.district,
            zone: update.zone,
            country: update.country,
            username: update.username,
            p_description: update.p_description,
        });
    })
})

app.get('/search', function (req, res, data) {
    db.pets.find(function (err, docs) {
        console.log(docs);
        res.render('search.ejs', {
            pets: docs,
        });
    })
});

app.get('/signin', function (req, res) {
    res.render('signin.ejs');
});

app.post('/search/pets/add', function (req, res) {
    var search = {
        types_of_pet: req.body.types_of_pet,
        gender: req.body.gender,
        years_old: req.body.years_old,
    };
    db.pets.find(function (err, docs) {
        console.log(docs);
        res.render('search.ejs', {
            pets: docs,
            types_of_pet: search.types_of_pet,
            gender: search.gender,
            years_old: search.years_old
        });
    })
});

app.post('/login', function (req, res) {
    console.log(req.body.username,
        req.body.password);

    var MongoClient=require('mongodb').MongoClient;

    // MongoClient.connect("mongodb://192.168.1.51:27017/myfirst",function(err,db){
    //     db.collection("pets",function(err,collection){
    //         collection.find({username:"alvin123"}).toArray(function(err,items){
    //             if(err) throw err;
    //             console.log(items);
    //             console.log("We found "+items.length+" results!");
    //         });
    //
    //     });
    //     db.close(); //關閉連線
    // });
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
//db.pets.insert({"username":"alvin123", "password":"alvin123", "emailaddr":"alvin@ymail.com", "f_name":"Alvin", "l_name":"Luk", "country":"China", "district":"HK", "zone":1, "p_name":"vin", "p_age":8, "p_gender":"m", "type_of_p":"cat", "p_description":"h"})
//db.pets.insert({"username":"kelvin123", "password":"kelvin123", "emailaddr":"kelvin@ymail.com", "f_name":"Kelvin", "l_name":"Siu", "country":"China", "district":"HK", "zone":2, "p_name":"kel", "p_age":6, "p_gender":"f","type_of_p":"cat", "p_description":"i"})
//db.pets.insert({"username":"matthew123", "password":"matthew123", "emailaddr":"matthew@ymail.com", "f_name":"Matthew", "l_name":"Ting", "country":"China", "district":"HK", "zone":3, "p_name":"mat", "p_age":3, "p_gender":"m","type_of_p":"dog", "p_description":"j"})
//db.pets.insert({"username":"tony123", "password":"tony123", "emailaddr":"tony@ymail.com", "f_name":"Tony", "l_name":"Tsang", "country":"China", "district":"HK", "zone":4, "p_name":"ton", "p_age":5, "p_gender":"f","type_of_p":"dog", "p_description":"k"})
//db.pets.insert({"username":"thomas123", "password":"thomas123", "emailaddr":"thomas@ymail.com", "f_name":"Thomas", "l_name":"Li", "country":"China", "district":"HK", "zone":5, "p_name":"mas", "p_age":2, "p_gender":"m","type_of_p":"cat", "p_description":"l"})