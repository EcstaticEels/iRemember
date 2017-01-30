//Basic server
const express = require('express');
const app = express();
var path = require('path');

var axios = require('axios');

//Database
const db = require('../database/db.js');

const sdk = require('exponent-server-sdk');

//Middleware
const bodyParser = require('body-parser');
const morgan = require('morgan');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));


//Express static
app.use(express.static(path.join(__dirname, '..', 'public')));

//Controllers
// const mobileControllers = require('./mobileControllers.js');

//Mobile
// app.get('/mobile/reminders', mobileControllers.sendReminder);

app.listen(8000, function () {
  console.log('8000!');
    db.Reminder.findAll({
      where: {
        date: {
          $lt: new Date
          // [(new Date()).getTime() - 60000, (new Date()).getTime() + 60000]
        }
      }
    })
    .then(result => {
      console.log('cron activated');
      sdk.sendPushNotificationAsync({
      exponentPushToken: 'ExponentPushToken[uLzPfmKf9566YbVGdrC-_O]', // The push token for the app user you want to send the notification to 
        message: "This is a test notification",
        data: { content: "" }
      });
    })
});

