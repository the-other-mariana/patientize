var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/patientizedb';
const webtitle = 'Patientize';

var currUser = null;
var loggedUser = "";
var successLog = false;
var patientIndex = 33;
var templateIndex = 33;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: webtitle, success: req.session.success, errors: req.session.errors, user: req.session.user });
  req.session.errors = null;
  req.session.success = null;

  // get users from db for developer version
  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }
    var cursor = db.collection('doctors').find();
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
    db.collection('doctors').drop(function(err, result){
      if(err != null){
        console.log("error dropping");
      }
      if (result){
        console.log("user-data collection dropped");
        //res.redirect('/');
        successLog = false;
        loggedUser = "";
        currUser=null;
  
        res.render('index', { title: 'Patientize', errors: null, success: false, user: ""});
        req.session.errors = null;
      }
    });
  });

});

// go to register form page
router.post('/register', function(req, res, next){

  MongoClient.connect(url, function(err, db){
    db.collection('doctors').count().then(function(count){
      if(count == 0){
        console.log("no users");
      }else{
        console.log("has users");
      }
      res.render('register', { title: 'Patientize', errors: req.session.errors });
    });
  });
  req.session.errors = null;

});

// for register account button
router.post('/register/submit-account', function(req, res, next){

  var inputUsername = req.body.username;
  var inputPassword = req.body.password;
  var inputSpecialty = req.body.specialty;
  var inputGender = req.body.gender;
  var inputFullName = req.body.fullname;
  var inputDGP = req.body.dgp;

  var profilePic = "";

  if (inputGender == "female"){
    profilePic = "default-female.png";
  } else{
    profilePic = "default-male.png";
  }

  var userID = "";
  var objectID = null;

  // mongodb user insertion
  var item = {
    username: inputUsername,
    password: inputPassword,
    name: inputFullName,
    profilePic: profilePic,
    specialty: inputSpecialty,
    dgp: inputDGP,
    gender: inputGender,
    email: "example@me.com",
    mobile: "111 111 1111",
    templates: [],
    patients:[]
  };
  MongoClient.connect(url, function(err, db){
    db.collection('doctors').count().then((count) => {
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

      db.collection('doctors').insertOne(item, function(err, result){
        userID = (result.insertedId).toString();
        objectID = result.insertedId;

        console.log('Item inserted, id:' + (result.insertedId).toString());

      });
      db.close();
    });
  });

  //res.redirect('/');
  successLog = false;
  loggedUser = "";
  currUser=null;

  res.render('index', { title: 'Patientize', errors: null, success: false, user: ""});
  req.session.errors = null;
});

// for login button in home page
router.post('/user', function(req, res, next){

  var loginusername = req.body.loginusername;
  var loginpassword = req.body.loginpassword;
  var exists = false;
  var userID = "";
  var objectID;

  console.log(typeof req.body);
  console.log(req.body);

  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }
    var cursor = db.collection('doctors').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loginusername && doc.password == loginpassword){
        currUser = doc;
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
        loggedUser = req.session.user;
        successLog = true;
        console.log("logged user: " + req.session.user);
        //res.redirect('/');
        res.render('user', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser });
        req.session.errors = null;
      }else{
        successLog = false;
        req.session.success = false;
        req.session.user = "";
        req.session.mongoID = null;
        console.log("unsuccessfull validation");
        res.redirect('/');
      }
    });
  });


});

// for AJAX resource
router.get('/profpic', function(req, res, next) {
  // mongo db get data
  var profilePic = "";
  
  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }
    var cursor = db.collection('doctors').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loggedUser){
        profilePic = doc.profilePic;
      }
    }, function(){
      db.close();
      res.send(profilePic);

      console.log("Pic: " + profilePic);
    });
  });

});

// for AJAX resource
router.get('/mainInfo', function(req, res, next) {
  
  console.log("current user doc:");
  console.log(currUser);
  res.send(currUser);

});


router.post('/updateInfo', function(req, res, next){
  var newvalues={};
  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }
    var cursor = db.collection('doctors').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loggedUser){
        
        myquery = {username: loggedUser};
        newvalues = {
          username: doc.username, 
          password: doc.password, 
          name: req.body.upname,
          profilePic: doc.profilePic, 
          specialty: req.body.upspecialty,
          dgp: req.body.updgp,
          gender: doc.gender,
          email: req.body.upemail, 
          mobile: req.body.upmobile,
          templates: doc.templates,
          patients: doc.patients
        };

        currUser = newvalues;
        
        db.collection("doctors").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
      }
    }, function(){
      db.close();
    });
    
  });
  res.render('user', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser });
});

router.post('/patients', function(req, res, next){

  res.render('patients', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser });
  req.session.errors = null;

});

router.post('/addPatient', function(req, res, next){
  console.log("new patient...");

  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }

    var dob = new Date(req.body.pbirth);  
    //calculate month difference from current date in time  
    var month_diff = Date.now() - dob.getTime();  
      
    //convert the calculated difference in date format  
    var age_dt = new Date(month_diff);   
      
    //extract year from date      
    var year = age_dt.getUTCFullYear();  
      
    //now calculate the age of the user  
    var cage = Math.abs(year - 1970);  

    var cursor = db.collection('doctors').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loggedUser){
        newPatient = {
          lastname: req.body.plname, 
          name: req.body.pname,
          email: req.body.pemail,
          mobile: req.body.pmobile,
          gender: req.body.pgender,
          birthdate: req.body.pbirth,
          age: cage,
          records: [],
          documents: []
        };

        var cpatients = doc.patients;
        cpatients.push(newPatient);

        myquery = {username: loggedUser};
        newvalues = {
          username: doc.username, 
          password: doc.password, 
          name: doc.name, 
          profilePic: doc.profilePic,
          specialty: doc.specialty,
          dgp: doc.dgp,
          gender: doc.gender,
          email: doc.email,
          mobile: doc.mobile,
          templates: doc.templates,
          patients: cpatients,
        };
        currUser = newvalues;
        db.collection("doctors").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
      }
    }, function(){
      db.close();
    });
    
  });
  res.render('patients', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser });
  req.session.errors = null;
});

// for AJAX resource
router.get('/patientsInfo', function(req, res, next) {
  // mongo db get data
  var cpatients = [];

  cpatients = currUser.patients;
  res.send(cpatients);

});

// for AJAX resource
router.get('/patient/patientDetails', function(req, res, next) {
  
  res.send(currUser.patients[patientIndex]);

});

// for AJAX resource
router.get('/patient/doctorDetails', function(req, res, next) {
  
  res.send(currUser);

});

// for AJAX resource
router.get('/patient/templateDetails', function(req, res, next) {
  
  res.send(currUser.templates);

});

// for AJAX resource
router.get('/templatesInfo', function(req, res, next) {
  res.send(currUser.templates);

});

router.get('/patient/:id', function(req, res, next){

  patientIndex = parseInt(req.params.id);
  var name = currUser.patients[patientIndex].name;
  console.log("backend patient index: " + req.params.id);
  res.render('details', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser, patientName: name, patJSON: encodeURIComponent(JSON.stringify(currUser.patients[patientIndex])) });
});

router.post('/home', function(req, res, next){
  if (successLog == true){
    res.render('user', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser });
  }else{
    res.render('index', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser });
  }
  
  req.session.errors = null;

});

router.post('/logout', function(req, res, next){
  
  successLog = false;
  loggedUser = "";
  currUser=null;
  
  res.render('index', { title: 'Patientize', errors: null, success: false, user: ""});
  req.session.errors = null;
});

router.post('/patient/addRecord', function(req, res, next){
  console.log("new record...");

  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }

    var cursor = db.collection('doctors').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loggedUser){

        newRecord = {
          appointment: req.body.rappointment,
          motive: req.body.rmotive,
          results: req.body.rresults,
          diagnosis: req.body.rdiagnosis,
          treatment: req.body.rtreatment
        };

        var crecords = doc.patients[patientIndex].records;
        crecords.push(newRecord);

        newPatient = {
          lastname: doc.patients[patientIndex].lastname, 
          name: doc.patients[patientIndex].name,
          email: doc.patients[patientIndex].email,
          mobile: doc.patients[patientIndex].mobile,
          gender: doc.patients[patientIndex].gender,
          birthdate: doc.patients[patientIndex].birthdate,
          age: doc.patients[patientIndex].age,
          records: crecords,
          documents: doc.patients[patientIndex].documents
        };

        var cpatients = doc.patients;
        cpatients[patientIndex] = newPatient;

        myquery = {username: loggedUser};
        newvalues = {
          username: doc.username, 
          password: doc.password, 
          name: doc.name, 
          profilePic: doc.profilePic,
          specialty: doc.specialty,
          dgp: doc.dgp,
          gender: doc.gender,
          email: doc.email,
          mobile: doc.mobile,
          templates: doc.templates,
          patients: cpatients
        };

        currUser = newvalues;
        console.log(newPatient);
        
        db.collection("doctors").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
      }
    }, function(){
      db.close();
    });
    
  });

  var name = currUser.patients[patientIndex].name;
  res.render('details', { title: 'Patientize', errors: req.session.errors, success: successLog, user: loggedUser, patientName: name, patJSON: encodeURIComponent(JSON.stringify(currUser.patients[patientIndex])) });
  req.session.errors = null;
});

router.post('/patient/addPrescription', function(req, res, next){
  console.log("new prescription...");

  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }

    var cursor = db.collection('doctors').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loggedUser){

        // type will change with every document type
        newDoc = {
          type: "prescription",
          appointment: req.body.pappointment,
          doctor: req.body.pdoctor,
          dgp: req.body.pdgp,
          diagnosis: req.body.pdiagnosis,
          indications: req.body.pindications
        };

        var cdocs = doc.patients[patientIndex].documents;
        cdocs.push(newDoc);

        newPatient = {
          lastname: doc.patients[patientIndex].lastname, 
          name: doc.patients[patientIndex].name,
          email: doc.patients[patientIndex].email,
          mobile: doc.patients[patientIndex].mobile,
          gender: doc.patients[patientIndex].gender,
          birthdate: doc.patients[patientIndex].birthdate,
          age: doc.patients[patientIndex].age,
          records: doc.patients[patientIndex].records,
          documents: cdocs
        };

        var cpatients = doc.patients;
        cpatients[patientIndex] = newPatient;

        myquery = {username: loggedUser};
        newvalues = {
          username: doc.username, 
          password: doc.password, 
          name: doc.name, 
          profilePic: doc.profilePic,
          specialty: doc.specialty,
          dgp: doc.dgp,
          gender: doc.gender,
          email: doc.email,
          mobile: doc.mobile,
          templates: doc.templates,
          patients: cpatients,
        };

        currUser = newvalues;
        console.log(newPatient);
        
        db.collection("doctors").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
      }
    }, function(){
      db.close();
    });
    
  });

  var name = currUser.patients[patientIndex].name;
  res.render('details', { title: 'Patientize', errors: req.session.errors, success: successLog, user: loggedUser, patientName: name, patJSON: encodeURIComponent(JSON.stringify(currUser.patients[patientIndex]))});
  req.session.errors = null;
});

router.post('/templates', function(req, res, next){

  res.render('templates', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser });
  req.session.errors = null;

});

router.get('/templates', function(req, res, next){

  res.render('templates', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser });
  req.session.errors = null;

});

router.post('/addTemplate', function(req, res, next){
  console.log("new template...");
  console.log(req.body); 

  var inputTemplate = req.body;
  var keys = Object.keys(inputTemplate);
  tLength = (keys.length - 2) / 2;

  var newTemplate = {};
  newTemplate['ttitle'] = inputTemplate['t-title'];
  newTemplate['tcolor'] = inputTemplate['t-color'];
  for (var i = 0; i < tLength; i++){
    newKey = inputTemplate[Object.keys(inputTemplate)[(i * 2) + 2]].split(' ').join('_');
    newVal = Object.keys(inputTemplate)[(i * 2) + 3];
    newTemplate[newKey] = inputTemplate[newVal];
  }
  console.log(newTemplate);
  console.log(Object.keys(newTemplate));
  
  // add the new template to the db
  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }

    var cursor = db.collection('doctors').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loggedUser){

        var ctemplates = doc.templates;
        ctemplates.push(newTemplate);

        myquery = {username: loggedUser};
        newvalues = {
          username: doc.username, 
          password: doc.password, 
          name: doc.name, 
          profilePic: doc.profilePic,
          specialty: doc.specialty,
          dgp: doc.dgp,
          gender: doc.gender,
          email: doc.email,
          mobile: doc.mobile,
          templates: ctemplates,
          patients: doc.patients,
        };
        currUser = newvalues;
        db.collection("doctors").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
      }
    }, function(){
      db.close();
    });
    
  });
  res.render('templates', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser });
  req.session.errors = null;
});

router.get('/delete/:tempId', function(req, res, next){
  console.log("I want to delete template " + req.params.tempId);
  
  templateIndex = parseInt(req.params.tempId);
  currUser.templates.splice(templateIndex, 1);
  dtemplates = currUser.templates;
  console.log(dtemplates);
  
  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }

    var cursor = db.collection('doctors').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loggedUser){

        myquery = {username: loggedUser};
        newvalues = {
          username: doc.username, 
          password: doc.password, 
          name: doc.name, 
          profilePic: doc.profilePic,
          specialty: doc.specialty,
          dgp: doc.dgp,
          gender: doc.gender,
          email: doc.email,
          mobile: doc.mobile,
          templates: dtemplates,
          patients: doc.patients,
        };
        currUser = newvalues;
        db.collection("doctors").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
      }
    }, function(){
      db.close();
    });
  });
  
  res.redirect('/templates');
});

router.post('/patient/addDoc', function(req, res, next){
  console.log("new doc...");
  
  
  MongoClient.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }

    var cursor = db.collection('doctors').find();
    cursor.forEach(function(doc, err){
      if (doc.username == loggedUser){
        var newDoc = {type : "template"};
        var keys = Object.keys(req.body);
        for (var i = 0; i < keys.length; i++){
          newDoc[keys[i]] = req.body[keys[i]];
        }
        console.log(newDoc);
        var cdocs = doc.patients[patientIndex].documents;
        cdocs.push(newDoc);

        newPatient = {
          lastname: doc.patients[patientIndex].lastname, 
          name: doc.patients[patientIndex].name,
          email: doc.patients[patientIndex].email,
          mobile: doc.patients[patientIndex].mobile,
          gender: doc.patients[patientIndex].gender,
          birthdate: doc.patients[patientIndex].birthdate,
          age: doc.patients[patientIndex].age,
          records: doc.patients[patientIndex].records,
          documents: cdocs
        };

        var cpatients = doc.patients;
        cpatients[patientIndex] = newPatient;

        myquery = {username: loggedUser};
        newvalues = {
          username: doc.username, 
          password: doc.password, 
          name: doc.name, 
          profilePic: doc.profilePic,
          specialty: doc.specialty,
          dgp: doc.dgp,
          gender: doc.gender,
          email: doc.email,
          mobile: doc.mobile,
          templates: doc.templates,
          patients: cpatients,
        };

        currUser = newvalues;
        console.log(newPatient);
        
        db.collection("doctors").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
      }
    }, function(){
      db.close();
    });
    
  });
  
  var name = currUser.patients[patientIndex].name;
  res.render('details', { title: webtitle, errors: req.session.errors, success: successLog, user: loggedUser, patientName: name, patJSON: encodeURIComponent(JSON.stringify(currUser.patients[patientIndex])) });
  req.session.errors = null;
});

router.get('/patient/editDoc/:docIndex', function(req, res, next){
  console.log("I want to edit doc " + req.params.docIndex);
  
  
  
  res.redirect('/patient/' + patientIndex);
});

module.exports = router;
