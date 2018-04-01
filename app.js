var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongojs = require('mongojs');
var db = mongojs('myfirst', ['pets']);
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
//MongoClient.connect('mongodb://192.168.1.51:27017', function (err, db) {
//    if (err) {
//        throw err;
//    } else {
//        console.log("connected");
//    }
//    db.close();
//});
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
    res.locals.type_of_p = null;
    res.locals.p_gender = null;
    res.locals.p_age = null;
    next();
});

app.get('/', function (req, res) {
    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    }
    res.render('index.ejs', {isLogined: logined});
});

app.get('/contact', function (req,res) {
    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    }
    res.render('contact.ejs', {isLogined: logined});
});

app.get('/feedback', function (req, res) {
    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    }
    res.render('feedback.ejs',{isLogined: logined});
});

app.get('/profile', function (req, res, data) {

    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    }

    var username = {username: req.session.username};
    db.pets.find(username).toArray(function (err, docs) {
        console.log(docs);
        res.render('profile.ejs', {isLogined: logined,
            pets: docs,
        });
    });
});

app.post('/profile', function (req, res) {

    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    }

    var update = {
        $set:
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
    };
    var user = {username: req.body.username};
    db.pets.update(user, update, function (err, docs) {
        console.log(docs);
        db.pets.find(user).toArray(function (err, result) {
            console.log(result);
            res.render('profile.ejs', {isLogined: logined,
                pets: result,
            });
        });

    });
});

app.get('/search', function (req, res, data) {

    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    }

    db.pets.find(function (err, docs) {
        console.log(docs);
        res.render('search.ejs', {
            isLogined: logined,
            pets: docs,
        });
    })
});

app.get('/signup', function (req, res) {

    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    }

    res.render('signup.ejs',{isLogined:logined});
});

app.post('/signup', function (req, res) {
    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    }
    var user = {username: req.body.username};
    var insert = {
        username: req.body.username,
        password: req.body.password,
        emailaddr: req.body.emailaddr,
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        country: req.body.country,
        district: req.body.district,
        zone: req.body.zone,
    };
    db.pets.find(user).toArray(function(err, result){
        if (err)
            throw err;
        console.log(result);
        console.log(result.length);
        if (result.length == 0){
            db.pets.insert(insert, function(err, docs){
                console.log("created");
                res.render('signup.ejs',{isLogined:logined});
            });
        }
        else{
            res.redirect("/signup");
        }
    })

});

app.post('/search', function(req, res){
    var logined = false;
    if (req.session.sign) {
        console.log(req.session);
        logined = true;
    }

    db.pets.find(function (err, docs){
        console.log(docs);
        res.render('search.ejs', {
            isLogined: logined,
            pets: docs,
            type_of_p: req.body.type_of_p,
            p_gender: req.body.p_gender,
            p_age: req.body.p_age
        });
    })
});
app.post('/login', function (req, res) {
    console.log(req.body.username,
        req.body.password);
    var url = "mongodb://127.0.0.1:27017/";
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("myfirst");
        dbo.collection("pets").find({
            username: req.body.username,
            password: req.body.password
        }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            console.log(result.length);
            db.close();
            var logined = false;
            if (result == null || result.length != 1) {
                console.log("Login Fail");
                res.redirect("/");
            } else {
                console.log("Login Success");
                if (req.session.sign) {
                    console.log(req.session);
                    logined = true;
                } else {
                    console.log("session not assign");
                    req.session.sign = true;
                    console.log(req.session);
                    req.session.username = result[0].username;
                    console.log(req.session.username);
                    res.redirect("/");
                }
            }
        });
    });
});

app.post('/logout', function (req, res) {
    console.log(req.session.username);
    req.session.destroy();
    res.redirect("/");
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

//add them in db
//db.pets.insert({"username":"alvin123", "password":"alvin123", "emailaddr":"alvin@ymail.com", "f_name":"Alvin", "l_name":"Luk", "country":"China", "district":"HK", "zone":1, "p_name":"teddy", "p_age":5, "p_gender":"m", "type_of_p":"dog", "p_description":"h"})
//db.pets.insert({"username":"kelvin123", "password":"kelvin123", "emailaddr":"kelvin@ymail.com", "f_name":"Kelvin", "l_name":"Siu", "country":"China", "district":"HK", "zone":2, "p_name":"tommy", "p_age":2, "p_gender":"m","type_of_p":"cat", "p_description":"i"})
//db.pets.insert({"username":"matthew123", "password":"matthew123", "emailaddr":"matthew@ymail.com", "f_name":"Matthew", "l_name":"Ting", "country":"China", "district":"HK", "zone":3, "p_name":"cody", "p_age":2, "p_gender":"f","type_of_p":"dog", "p_description":"j"})
//db.pets.insert({"username":"tony123", "password":"tony123", "emailaddr":"tony@ymail.com", "f_name":"Tony", "l_name":"Tsang", "country":"China", "district":"HK", "zone":4, "p_name":"jenny", "p_age":7, "p_gender":"f","type_of_p":"cat", "p_description":"k"})
//db.pets.insert({"username":"thomas123", "password":"thomas123", "emailaddr":"thomas@ymail.com", "f_name":"Thomas", "l_name":"Li", "country":"China", "district":"HK", "zone":5, "p_name":"mas", "p_age":2, "p_gender":"m","type_of_p":"cat", "p_description":"l"})