var CronJob = require('cron').CronJob;
const db = require('../database/db.js');

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