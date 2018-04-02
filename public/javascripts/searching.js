var http = require('http');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var myfirst = express();
var mongojs = require('mongojs');
//var mongoose = require('mongoose');
var db = mongojs('myfirst', ['pets']);
var MongoClient = require('mongodb').MongoClient,format = require('util').format;
MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', function(err,db){
  if(err){
    throw err;
  }else{
    console.log("connected");
  }
  db.close();
});
/*var logger = function(req, res, next){
  console.log('logging...');
  next();
}

myfirst.use(logger);
*/

//view engine
myfirst.set('view engine', 'ejs');
myfirst.set('views', path.join(__dirname, 'views'));
//body parser
myfirst.use(bodyParser.json());
myfirst.use(bodyParser.urlencoded({extended: false}));
//static path
myfirst.use(express.static(path.join(__dirname, 'public')));

myfirst.use(function(req, res, next){
  res.locals.errors = null;
  res.locals.types_of_pet = null;
  res.locals.gender = null;
  res.locals.years_old = null;
  next();
});

myfirst.post('/create-user', expressValidator, (req, res, next) => {
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
  };
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    // Response will contain something like
    // { errors: [ "body[password]: must be at least 10 chars long" ] }
    return res.json({ errors: result.array() });
  }

  // Handle your request as if no errors happened
});

/* db list
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


myfirst.get('/', function(req, res, data){
    db.pets.find(function (err, docs){
      console.log(docs);

      res.render('search.ejs', {
        pets: docs,

      });
    })

});


myfirst.post('/pets/add', function(req, res){


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











// myfirst.listen(3000, function(){
//     console.log('Server started on Port 3000...');
// })
