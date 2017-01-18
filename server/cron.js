var CronJob = require('cron').CronJob;
const db = require('../database/db.js');
const sdk = require('exponent-server-sdk');

var job = new CronJob('* 0 * * * *', 
  function() {
    db.Reminder.destroy({
      where: {
        date: {
          $lt: new Date()
        }
      }, 
      order: [['date']]
    })
    .then(result => {
      console.log('cron deleted', result);
    })
  }, function () {
    /* This function is executed when the job stops */
    // var reminderDate = new Date(remi)
  },
  true, /* Start the job right now */
  'America/Los_Angeles' //timezone
);

var reminder = new CronJob('0 1 * * * *', 
  function() {
    db.Reminder.findAll({
      where: {
        date: {
          $between: [(new Date()).getTime() - 60000, (new Date()).getTime() + 60000]
        }
      }
    })
    .then(result => {
      console.log('cron activated', result);
      sdk.sendPushNotificationAsync({
      exponentPushToken: 'ExponentPushToken[uLzPfmKf9566YbVGdrC-_O]', // The push token for the app user you want to send the notification to 
        message: "This is a test notification",
        data: { content: "" }
      });
    })
  }, function () {
    /* This function is executed when the job stops */
    // var reminderDate = new Date(remi)
  },
  true, /* Start the job right now */
  'America/Los_Angeles');
