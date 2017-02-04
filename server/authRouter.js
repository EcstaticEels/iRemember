const express = require('express');
const authRouter = express.Router();
const passport = require('passport');
const db = require('../database/db.js');

authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile'] })
);

authRouter.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/'
  }), function(req, res) {
    console.log('req.user', req.user)
    res.redirect('/');
  }); 

authRouter.get('/user', function(req, res) {
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
      .catch(err => {
        console.log('err in get /user', err);
        res.status(500);
      })
    } else {
      res.status(200).send(JSON.stringify({caregiver: req.user}));
    }
  }
});

authRouter.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send('logged out'); 
    }
  });
});

module.exports = authRouter;