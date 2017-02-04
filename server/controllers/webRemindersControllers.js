const cloudinary = require('cloudinary');
const multiparty = require('multiparty');
const request = require('request');
const db = require('../../database/db.js');
const sdk = require('exponent-server-sdk');

//Set up cloudinary--env variables in .env file
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_API_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const handleReminderForm = function(req, cb) {
  const reminderForm = new multiparty.Form();
  reminderForm.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
      res.status(400);
    }
    const urlArray = [];
    if (Object.keys(files).length > 0) {
      files.file.forEach(function(file) {
        cloudinary.v2.uploader.upload(file.path,
          { resource_type: 'raw' },
          function(error, result) {
            if (error) {
              console.log(error);
              res.status(400);
            }
            cb(result.url, fields);        
        });
      });
    } else {
      cb(null, fields);
    }
  });
};

module.exports = {
  addReminder: (req, res) => {
    handleReminderForm(req, (audioUrl, fields) => {
      console.log('audio', audioUrl, 'fields', fields)
      db.Reminder.create({ 
        date: fields.date[0],
        type: fields.type[0],
        note: fields.note[0],
        recurring: fields.recurring[0], 
        recurringDays: fields.recurringDays[0], 
        caregiverId: req.user.id,
        audio: audioUrl,
        title: fields.title[0],
        registered: false,
        patientId: req.user.patientId
      })
      .then(reminder => {
        console.log('res', reminder)
        res.status(201).send(JSON.stringify(reminder));
        db.Patient.findOne({
          where: {
            id: req.user.patientId
          }
        })
        .then(patient => {
          if (patient.token !== null) {
            sdk.sendPushNotificationAsync({
              exponentPushToken: patient.token, // The push token for the app user you want to send the notification to 
              message: "New Reminder Added"
            });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(400);
        })
      })
      .catch(err => {
        console.log(err);
        res.status(400);
      })
    });
  },
  retrieveReminders: (req, res) => {
    db.Reminder.findAll({
      where: {
        caregiverId: req.user.id,
        registered: {$ne: null}
      }, 
      order: [['date']]
    })
    .then(reminders => {
      res.status(200).send(JSON.stringify({reminders: reminders}));
    })
    .catch(err => {
      console.log(err);
      res.status(400);
    })
  },
  updateReminder: (req, res) => { 
    handleReminderForm(req, (audioUrl, fields) => {
      let reminderId = fields.reminderId[0];
      let updateObj = { 
        date: fields.date[0],
        type: fields.type[0],
        note: fields.note[0],
        registered: false,
        title: fields.title[0],
        recurring: fields.recurring[0],
        recurringDays: fields.recurringDays[0]
      }
      if (audioUrl) {
        updateObj.audio = audioUrl
      }
      db.Reminder.update(updateObj, {
        where: {
          id: reminderId
        }
      })
      .then(reminder => {
        db.Patient.findOne({
          where: {
            id: req.user.patientId
          }
        })
        .then(patient => {
          if (patient.token !== null) {
            sdk.sendPushNotificationAsync({
              exponentPushToken: patient.token, // The push token for the app user you want to send the notification to 
              message: "New Reminder Added"
            });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(400);
        })
      })
      .then(updatedReminder => {
        console.log('are we getting an updatedReminder', updatedReminder);
        res.status(200).send(JSON.stringify(updatedReminder));
      })
      .catch(err => {
        console.log(err);
        res.status(400);
      })
    })
  },
  deleteReminder: (req, res) => {
    let reminderId = req.body.reminderId;
    db.Reminder.update({registered: null}, { where: {id: reminderId}})
    .then(updatedReminder => {
      res.status(200).send('updated reminder to delete in mobile');
    })
    .catch(err => {
      console.log(err);
      res.status(400);
    });
  }
}