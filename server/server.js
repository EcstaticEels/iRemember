//Basic server
const express = require('express');
const app = express();
const path = require('path');

//Database
const db = require('../database/db.js');

//Middleware
const bodyParser = require('body-parser');
const morgan = require('morgan');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
require('dotenv').config(); //retrieves api keys

//Express static
app.use(express.static(path.join(__dirname, '..', 'public')));

//Controllers
const webControllers = require('./webControllers.js');
const mobileControllers = require('./mobileControllers.js');

//Routes

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public/webIndex.html'))
});
//Web
app.post('/web/identify', webControllers.addFace);
app.get('/web/identify', webControllers.retrieveFaces);
app.post('/web/reminders', webControllers.addReminder);
app.get('/web/reminders', webControllers.retrieveReminders);
//Mobile
app.post('/mobile/identify', mobileControllers.identifyFace);
app.get('/mobile/reminders', mobileControllers.retrieveReminders);

app.listen(3000, function () {
  console.log('iRemember is running on port 3000!')
});


