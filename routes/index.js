var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/arthubdb';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Art Hub', success: req.session.success, errors: req.session.errors, user: req.session.user });
  req.session.errors = null;
  req.session.success = null;

  // get users from db
  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err){
      console.log(doc);
    }, function(){
      db.close();
    });
  });
});

// for developer version: restart db button
router.post('/restart-db', function(req, res, next){
  MongoClient.connect(url, function(err, db){
    db.collection('user-data').drop(function(err, result){
      if(err != null){
        console.log("error dropping");
      }
      if (result){
        console.log("user-data collection dropped");
        res.redirect('/');
      }
    });
  });

});

// go to register form page
router.post('/register', function(req, res, next){

  MongoClient.connect(url, function(err, db){
    db.collection('user-data').count().then(function(count){
      if(count == 0){
        console.log("no users");
      }else{
        console.log("has users");
      }
      res.render('register', { title: 'Register Account', errors: req.session.errors });
    });
  });
  req.session.errors = null;

});

// for register account button
router.post('/register/submit-account', function(req, res, next){

  var inputUsername = req.body.username;
  var inputPassword = req.body.password;
  var loggedUser = req.session.user;
  var userID = "";
  var objectID = null;

  // mongodb user insertion
  var item = {
    username: inputUsername,
    password: inputPassword
  };
  MongoClient.connect(url, function(err, db){
    db.collection('user-data').count().then((count) => {
      console.log("number of users from db: " + count);

      // if creating super user
      if(count == 0){
        // add it to db
        console.log("no users");
      }
      // if super user already set up
      else{
        console.log("has users")
      }

      db.collection('user-data').insertOne(item, function(err, result){
        userID = (result.insertedId).toString();
        objectID = result.insertedId;

        console.log('Item inserted, id:' + (result.insertedId).toString());

      });
      db.close();
    });
  });

  res.redirect('/');
});

// for login button in home page
router.post('/login', function(req, res, next){

  var loginusername = req.body.loginusername;
  var loginpassword = req.body.loginpassword;
  var exists = false;
  var userID = "";
  var objectID;

  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loginusername && doc.password == loginpassword){
        exists = true;
        userID = (doc._id).toString();
        objectID = doc._id;
      }
    }, function(){
      db.close();

      if(exists == true){
        req.session.success = true;
        req.session.user = loginusername;
        req.session.mongoID = objectID;
        console.log("successfull validation of " + objectID);
        console.log("logged user: " + req.session.user);
        res.redirect('/');
      }else{
        req.session.success = false;
        req.session.user = "";
        req.session.mongoID = null;
        console.log("unsuccessfull validation");
        res.redirect('/');
      }
    });
  });



});

module.exports = router;
