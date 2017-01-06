//Basic server
const express = require('express');
const app = express();
var path = require('path');

//Database
const db = require('../database/db.js');

//Middleware
const bodyParser = require('body-parser');
const morgan = require('morgan');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
// require('dotenv').config(); //retrieves api keys

//Express static
app.use(express.static(path.join(__dirname, '..', 'public')));

//Controllers
const webControllers = require('./webControllers.js');
const mobileControllers = require('./mobileControllers.js');

//Web
app.post('/web/identify', webControllers.addFace);
app.put('/web/identify', webControllers.updateFace);
app.get('/web/identify', webControllers.retrieveFaces);
app.post('/web/reminders', webControllers.addReminder);
app.get('/web/reminders', webControllers.retrieveReminders);
app.put('/web/reminders', webControllers.updateReminder);
app.delete('/web/reminders', webControllers.deleteReminder);
//Mobile
app.post('/mobile/identify', mobileControllers.identifyFace);
app.get('/mobile/reminders', mobileControllers.retrieveReminders);

//Configure express to serve index.html at every other route that comes to server
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public/webIndex.html'))
});

app.listen(3000, function () {
  console.log('iRemember is running on port 3000!')
  //Insert into database
  // db.Caregiver.build({
  //   name: 'Bob',
  //   photo: 'https://www.aviary.com/img/photo-landscape.jpg',
  //   personGroupID: 'EcstaticEels'
  // }).save()
});



