const express = require('express');
const path = require('path');
const request = require('request');
const app = express();
const db = require('../database/db.js');

//Environment variables
require('dotenv').config();

//Middleware and Authentication Setup
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('profile', profile);
    db.Caregiver.findOrCreate({ 
      where: 
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

//Routers
const webFaceRouter = require('./webFaceRouter.js');
const webRemindersRouter = require('./webRemindersRouter.js');
const mobileRouter = require('./mobileRouter.js');
const authRouter = require('./authRouter.js');
app.use('/web/faces', webFaceRouter);
app.use('/web/reminders', webRemindersRouter);
app.use('/mobile', mobileRouter);
app.use('/auth', authRouter)

//Serve static files and node modules
app.use('/scripts', express.static(path.join(__dirname, '..', 'node_modules')))
app.use(express.static(path.join(__dirname, '..', 'public')));

//Serve index.html at every other route that comes to server
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public/webIndex.html'));
});

app.listen(3000, function () {
  console.log('iRemember is running on port 3000!');
});

module.exports = app;