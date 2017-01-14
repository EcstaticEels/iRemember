//Basic server
const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const passport = require('passport');
const request = require('request');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Environment variables
require('dotenv').config();

//Database
const db = require('../database/db.js');

//Middleware
const bodyParser = require('body-parser');
const morgan = require('morgan');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  maxAge: 604800000
}))
app.use(passport.initialize());
app.use(passport.session());

//Middleware function to ensure authentication to protected routes
const ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.status(401).send('you are not logged in'); 
}

//Google Strategy for Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('profile', profile);
    db.Caregiver.findOrCreate(
      { where: 
        { 
          googleId: profile.id,
          name: profile.displayName
        }
    })
    .then(caregiver => {
      cb(null, caregiver[0]);
    })
    .catch(err => {
      cb(err, null)
    });
  }
));

//Amazon S3 uploader middleware
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

// Initialize multers3 with our s3 config and other options
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

//Express static
app.use('/scripts', express.static(path.join(__dirname, '..', 'node_modules')))
app.use(express.static(path.join(__dirname, '..', 'public')));

//Controllers
const webControllers = require('./webControllers.js');
const mobileControllers = require('./mobileControllers.js');

//Web
app.post('/web/identify', ensureAuthenticated, webControllers.addFace);
app.put('/web/identify', ensureAuthenticated, webControllers.updateFace);
app.get('/web/identify', ensureAuthenticated, webControllers.retrieveFaces);
app.post('/web/reminders', ensureAuthenticated, webControllers.addReminder);
app.get('/web/reminders', ensureAuthenticated, webControllers.retrieveReminders);
app.put('/web/reminders', ensureAuthenticated, webControllers.updateReminder);
app.delete('/web/reminders', ensureAuthenticated, webControllers.deleteReminder);
app.post('/web/setup', ensureAuthenticated, webControllers.setup);

//Mobile
app.post('/mobile/identify', upload.single('picture'), mobileControllers.identifyFace);
app.put('mobile/token', mobileControllers.addToken);
app.get('/mobile/reminders', mobileControllers.retrieveReminders);
app.put('/mobile/reminders', mobileControllers.updateReminders);
app.post('/mobile/pushNotification', mobileControllers.addPushNotification);

//Authentication
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.Caregiver.findOne({
    where: {
      id: id
    }
  })
  .then(caregiver => {
    done(null, caregiver);
  })
  .catch(err => {
    done(err, null);
  })
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/user', function(req, res) {
  console.log(req.user)
  var userObj;
  if (req.user) {
    if (req.user.patientId) {
      db.Patient.findOne({
        where: {
          id: req.user.patientId
        }
      })
      .then(patient => {
        res.status(200).send(JSON.stringify({caregiver: req.user, patient: patient}))
      })
    } else {
      res.status(200).send(JSON.stringify({caregiver: req.user}));
    }
  }

});

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/signin'
  }), function(req, res) {
    console.log('req.user', req.user)
    console.log('req.session', req.session)
    res.redirect('/');
  }); 

app.get('/logout', function(req, res){
  req.session.destroy(function (err) {
    res.status(200).send('logged out'); 
  });
});

//Configure express to serve index.html at every other route that comes to server
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public/webIndex.html'));
});

app.listen(3000, function () {
  console.log('iRemember is running on port 3000!');
});



